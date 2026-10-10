#!/usr/bin/env python3
"""Original arithmetic checks for RoPE/cache interfaces; no trained model or service.
Run with Python >=3.9. All vectors and frequencies are synthetic.
"""
import json
import math
import random


def rotate(vector, position, frequencies):
    if len(vector) != 2 * len(frequencies):
        raise ValueError('The teaching layout pairs adjacent coordinates')
    result = []
    for i, frequency in enumerate(frequencies):
        a, b = vector[2*i:2*i+2]
        c, s = math.cos(position*frequency), math.sin(position*frequency)
        result.extend([c*a-s*b, s*a+c*b])
    return result


def dot(a, b):
    if len(a) != len(b):
        raise ValueError('Vector lengths differ')
    return sum(x*y for x, y in zip(a, b))


def norm(a):
    return math.sqrt(dot(a, a))


def distance(a, b):
    return norm([x-y for x, y in zip(a, b)])


def repair(key, position, old_frequencies, new_frequencies):
    if len(old_frequencies) != len(new_frequencies):
        raise ValueError('Rotary dimensions differ')
    return rotate(key, position, [b-a for a, b in zip(old_frequencies,new_frequencies)])


def attend(query, keys, values):
    # Keys supplied here are exactly the causally allowed prefix, including self.
    scores = [dot(query,key)/math.sqrt(len(query)) for key in keys]
    peak = max(scores)
    exp_scores = [math.exp(x-peak) for x in scores]
    denominator = sum(exp_scores)
    return [sum(e*v[i] for e,v in zip(exp_scores,values))/denominator
            for i in range(len(query))]


def layer(inputs, frequencies):
    # One head, identity Q/K/V projections, residual connection, no MLP or norm.
    keys = [rotate(x,i,frequencies) for i,x in enumerate(inputs)]
    values = [x[:] for x in inputs]
    outputs = []
    for i,x in enumerate(inputs):
        context = attend(rotate(x,i,frequencies),keys[:i+1],values[:i+1])
        outputs.append([a+b for a,b in zip(x,context)])
    return outputs, keys, values


def run_checks():
    randomizer = random.Random(20261010)
    checks = 0
    def require(condition, message):
        nonlocal checks
        if not condition:
            raise AssertionError(message)
        checks += 1
    for _ in range(100):
        q = [randomizer.uniform(-2,2) for _ in range(8)]
        k = [randomizer.uniform(-2,2) for _ in range(8)]
        old = [randomizer.uniform(.01,1) for _ in range(4)]
        new = [f*randomizer.uniform(.2,.9) for f in old]
        m,n,c = [randomizer.randint(0,80) for _ in range(3)]
        rq,rk = rotate(q,m,old),rotate(k,n,old)
        require(abs(norm(rq)-norm(q))<1e-12,'Norm preservation')
        require(abs(dot(rq,rk)-dot(q,rotate(k,n-m,old)))<1e-11,
                'Fixed-frequency relative rotation')
        require(abs(dot(rotate(q,m+c,old),rotate(k,n+c,old))-dot(rq,rk))<1e-11,
                'Common origin shift')
        old_key=rotate(k,n,old)
        repaired=repair(old_key,n,old,new)
        target_key=rotate(k,n,new)
        require(distance(repaired,target_key)<1e-11,'Local key repair with fixed base')
        mixed=dot(rotate(q,m,new),old_key)/math.sqrt(len(q))
        target=dot(rotate(q,m,new),target_key)/math.sqrt(len(q))
        spectral=max(2*abs(math.sin(n*(a-b)/2)) for a,b in zip(old,new))
        upper=norm(q)*norm(k)*spectral/math.sqrt(len(q))
        require(abs(mixed-target)<=upper+1e-11,'Local logit error upper bound')
        require(spectral<=min(2,abs(n)*max(abs(a-b) for a,b in zip(old,new)))+1e-12,
                'Saturated phase bound')
        # Positive amplitude factor: key repair additionally rescales by new/old.
        old_amp,new_amp=1.7,.8
        stored=[old_amp*v for v in old_key]
        rescaled=[new_amp/old_amp*v for v in repair(stored,n,old,new)]
        require(distance(rescaled,[new_amp*v for v in target_key])<1e-11,
                'Nonzero amplitude-factor correction')
    q=k=[1.,0.]
    old,new=[math.pi/2],[math.pi/4]
    mixed=dot(rotate(q,2,new),rotate(k,1,old))/math.sqrt(2)
    target=dot(rotate(q,2,new),rotate(k,1,new))/math.sqrt(2)
    require(abs(mixed-1/math.sqrt(2))<1e-12,'Two-plane mixed phase')
    require(abs(target-.5)<1e-12,'Two-plane target phase')
    require(abs(mixed-target)>.2,'Changed frequencies can change logits')
    embeddings=[[1.,.2],[.3,1.],[-.8,.4]]
    old,new=[.9],[.2]
    old_h1,old_k1,old_v1=layer(embeddings,old)
    new_h1,new_k1,new_v1=layer(embeddings,new)
    old_h2,old_k2,old_v2=layer(old_h1,old)
    new_h2,new_k2,new_v2=layer(new_h1,new)
    i=2
    k1=[repair(old_k1[n],n,old,new) for n in range(i)]+[new_k1[i]]
    v1=old_v1[:i]+[new_v1[i]]
    ctx1=attend(rotate(embeddings[i],i,new),k1,v1)
    suffix_h1=[a+b for a,b in zip(embeddings[i],ctx1)]
    require(distance(suffix_h1,new_h1[i])<1e-12,'First layer local repair succeeds')
    k2=[repair(old_k2[n],n,old,new) for n in range(i)]+[new_k2[i]]
    v2=old_v2[:i]+[new_v2[i]]
    ctx2=attend(rotate(suffix_h1,i,new),k2,v2)
    suffix_h2=[a+b for a,b in zip(suffix_h1,ctx2)]
    hidden_error=distance(old_h1[1],new_h1[1])
    repaired_error=distance(suffix_h2,new_h2[i])
    require(hidden_error>1e-3,'Historical hidden states change')
    require(repaired_error>1e-3,'Rephasing all cached keys does not rebuild history')
    # A fixed frequency protocol permits causal incremental evaluation in this toy.
    for prefix_length in [1,2,3]:
        h1,_,_=layer(embeddings[:prefix_length],new)
        h2,_,_=layer(h1,new)
        require(distance(h2[-1],new_h2[prefix_length-1])<1e-12,'Causal frozen-prefix consistency')
    return {'checks':checks,'two_plane_logits':{'mixed':mixed,'target':target},
            'two_layer_toy':{'historical_hidden_l2':hidden_error,
                             'rephased_cache_vs_full_new_l2':repaired_error},
            'scope':'Synthetic double-precision arithmetic and an untrained two-layer causal attention toy; no LLM, GPU, latency, throughput or quality benchmark'}

if __name__=='__main__':
    print(json.dumps(run_checks(),indent=2))
