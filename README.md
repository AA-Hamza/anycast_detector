# anycast_catcher

This is a simple tool that tries to detect if the provided ip is anycasted or not.

## What is anycasting anyway?

Taken from [wikipedia](https://en.wikipedia.org/wiki/Anycast)

> Anycast is a network addressing and routing methodology in which a single IP address is shared by devices (generally servers) in multiple locations. Routers direct packets addressed to this destination to the location nearest the sender.

Simply put, multiple servers in different locations share the same IP and any of them can respond to the request sent to this IP.

Here is a simple graph
![anycast](https://github.com/AA-Hamza/anycast_detector/assets/33000142/2eaa5a89-7478-4647-8767-554fa58db279)

## How to detect anycasted ip?

This is a tough problem and there are not straight forward solutions, unless you know the [routing tables of majour ISPs](https://serverfault.com/a/577061).
My solution puts different servers at different locations, pinging the target IP address and checking if the request RTT (round trip time) beats the speed of light.

#### Promises

1. False postives are not possible
2. False negatives are likely

Example

```
configuration:
    1. Server #1 in Europe in germany
    2. Server #2 in USA in california

target: google dns 8.8.8.8

server #1 responds in 19ms
server #2 responds in 18ms

knowing the locations of these servers, the minimum latency assuming straight line and speed of light is 61ms

The IP address is definitely an Anycast
```

## Installation & usage

```
npm install
npm run dev
```

I am using aws lambda (serverless) for deployment. you can use the serverless.yaml (serverless framework) to deploy your own versions
That is why I am using tcp ping instead of regular ICMP

example .env

```
SERVERS=http://server1.test|http://server2.test
THIS_SERVER=http://server1.test
INTERNAL_API_KEY=SECRET_PASSWORD_USED_ACROSS_NODES
```

## Technical Design

The application has to have multiple nodes to be able to detect anycast IP addresses. each node has a list of the available nodes

Every node supports these simple operations:

1. Reporting it's own geo location using ip-api.com
2. Pinging an IP address
3. Broadcasting to the other nodes

All of these operations are secured used a token/password.
Then each node exposes a simple api call publicly to detect anycasts.

#### when an anycast call arrives:

1. the hit node calls other nodes to get their geo location (cached)
2. Broadcast the ping request to available nodes (including itself)
3. Wait for coming latency results. If any node latency beats the speed of light, the call returns.

### What happens when I enter a domain name instead of an IP address

First of all, cool.
The tool will work however the result may be incorrect because the domain name is likely using [DNS loadbalancing](https://www.cloudflare.com/learning/performance/what-is-dns-load-balancing/)

![Untitled-2024-03-09-2010](https://github.com/AA-Hamza/anycast_detector/assets/33000142/63e7e0bc-e351-4928-8485-9a160cb9061d)
