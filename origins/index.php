<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="The background behind the research. From early network security and IRC communities through fifteen years of professional infosec to independent AI and LLM vulnerability research.">
    <title>mwilliams.cc // Origins</title>
    <style>
        body {
            background-color: #fffff8;
            color: #111;
            font-family: "ETBook", "Palatino", "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif;
            margin: 0;
            display: flex;
            justify-content: flex-start;
            text-rendering: optimizeLegibility;
        }

        nav {
            width: 260px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            padding: 4rem 2rem;
            box-sizing: border-box;
            border-right: 1px solid #efefef;
            background-color: #fcfcf7;
        }

        nav h2 {
            font-variant: small-caps;
            font-weight: normal;
            font-size: 0.9rem;
            letter-spacing: 0.1em;
            margin: 2rem 0 0.5rem 0;
            color: #666;
            border-bottom: 1px solid #ddd;
        }

        nav ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        nav ul li {
            margin: 0.4rem 0;
        }

        nav a {
            color: #111;
            text-decoration: none;
            font-style: italic;
            font-size: 0.95rem;
        }

        nav a:hover {
            text-decoration: underline;
            color: #990000;
        }

        main {
            margin-left: 260px;
            padding: 4rem 8% 4rem 8%;
            max-width: 800px;
        }

        h1 {
            font-weight: normal;
            font-style: italic;
            font-size: 2.5rem;
            margin: 0 0 0.5rem 0;
            line-height: 1.2;
        }

        .subtitle {
            font-style: italic;
            font-size: 1.2rem;
            color: #444;
            display: block;
            margin-bottom: 3rem;
        }

        section {
            margin-bottom: 4rem;
        }

        h3 {
            font-weight: normal;
            font-style: italic;
            font-size: 1.6rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 0.5rem;
        }

        p {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            text-align: justify;
            hyphens: auto;
        }

        a.inline {
            color: #111;
            text-decoration: underline;
        }

        a.inline:hover {
            color: #990000;
        }

        .screenshot {
            margin: 2rem 0;
            border: 1px solid #ddd;
            padding: 1rem;
            background-color: #fff;
            display: inline-block;
        }

        .screenshot img {
            display: block;
            max-width: 100%;
        }

        .screenshot figcaption {
            font-size: 0.85rem;
            color: #888;
            margin-top: 0.75rem;
            font-style: italic;
        }

        .node-id {
            font-family: monospace;
            font-size: 0.8rem;
            color: #888;
            margin-top: 5rem;
            border-top: 1px solid #eee;
            padding-top: 1rem;
        }
    </style>
</head>
<body>

<?php include $_SERVER['DOCUMENT_ROOT'] . '/nav.php'; ?>

<main>
    <h1>Origins</h1>
    <span class="subtitle">How curiosity becomes a career, whether you plan it or not.</span>

    <section>
        <h3>56k and a slow connection</h3>
        <p>It started with a 56k modem that kept getting slower. Not gradually — suspiciously. The kind of slow that makes you open a terminal and start asking questions. A <code>netstat</code> here, a look at running processes there, and eventually the answer: something was running on my machine that I hadn't put there.</p>

        <p>The tool was BackOrifice. Port 31337 — "elite" in the parlance of the IRC channels I was lurking in at the time. I learned how to kill it, how to close the port, how to clean up after it. And then, because that's how curiosity works, I started learning how it operated — what it was looking for, how it persisted, why the default credentials were always the first thing an attacker changed. The IRC communities of that era were a proper apprenticeship if you knew how to listen. Bash scripting was the common tongue. C was the language if you were serious. Perl was the upstart that everyone had opinions about.</p>
    </section>

    <section>
        <h3>SNEAK and the gap between encryption and security</h3>
        <p>Around this time I found <a class="inline" href="https://snarkles.net" target="_blank">SNEAK</a> — the Snarkles.Net Encryption Assortment Kit, written by a researcher who went by the handle Snarkles. It was a single PHP page that would take a string and run it through MD5, DES, Base64, ROT-13, Caesar bruteforce, and a handful of other transforms. Unglamorous by modern standards. Indispensable at the time.</p>

        <figure class="screenshot">
            <img src="/images/sneak-original.png" alt="SNEAK v1.28 — the original interface" />
            <figcaption>SNEAK v1.28 — Snarkles.Net Encryption Assortment Kit, circa 2003. Someone has typed p455w0rd into it, which feels about right.</figcaption>
        </figure>

        <p>What SNEAK actually taught me had nothing to do with encryption. It taught me that most things described as encrypted were not secure — they were just obscured. MD5 was a one-way hash, not a lock. DES had been broken in 1998 by a machine built for $250,000. Base64 is encoding, not encryption, a distinction that still trips people up today. Shadow password files of that era leaned heavily on these standards, and the gap between what administrators believed they had and what they actually had was the real attack surface.</p>

        <p>Snarkles moved on. She taught herself to code properly, got into Google Summer of Code, and the SNEAK page hasn't been updated since around 2008. That seems right — the tool did its job and she outgrew it, which is the best possible outcome for something you built to learn from. The page still resolves. That's more than most things from that era can say. Credit where it's due: the original code is hers, cleanly written, and still worth reading as an artefact of its moment. A modern version lives <a class="inline" href="/sneak">here</a> if you want to have a play.</p>
    </section>

    <section>
        <h3>Three things that changed how I think</h3>
        <p>The first was infosec itself — not as a discipline I chose, but as one I stumbled into through necessity and stayed in through genuine interest. Understanding how systems fail, how assumptions become vulnerabilities, and how the gap between perceived and actual security is where everything interesting happens.</p>

        <p>The second was cloud computing. I was head of infosec at an ISP when the company invested in cloud infrastructure, and what struck me wasn't the technology — it was the removal of friction. Labbing up a scenario used to mean begging for equipment, working nights to configure it, and tearing it down carefully because you might need that hardware again. Suddenly I could spin up an entire environment in minutes and delete it when I was done. The speed of experimentation changed everything about how I worked.</p>

        <p>The third is large language models. Not because they're impressive — though they are — but because they represent the same pattern I've been watching since that BackOrifice infection in the late nineties. A new technology, adopted faster than it's understood, with a significant gap between what users believe the system is doing and what it's actually doing. That gap is the attack surface. It always is.</p>
    </section>

    <section>
        <h3>Port 31337, then and now</h3>
        <p>In 2001, scanning for port 31337 was a way of finding machines where something powerful was running unattended — misconfigured, unpatched, and largely unnoticed by the people responsible for them. The owners often didn't know the door was open. The tool had been installed by someone else, or left by default, or simply forgotten.</p>

        <p>The equivalent today is scanning for LLM dependency. Organisations are integrating AI into sensitive processes — risk assessments, compliance checks, customer-facing decisions — and trusting the output with a confidence that isn't warranted by the technology. The models produce fluent, authoritative-sounding text regardless of whether the underlying reasoning is sound. The people signing off on those outputs frequently lack the technical context to know when they're looking at a hallucination dressed as analysis.</p>

        <p>This is the current research thread. The specifics will go in the <a class="inline" href="/llm">LLM Research</a> section as they become writable — some are disclosed, some are pending. But the through-line from that 56k connection to here is the same question it's always been: what does this system actually do, versus what do its owners think it does?</p>

        <p>The approach has changed too. Early on, you learn a technique and go looking for something it works on — cast wide, see what responds. The communities of that era ran on exactly that model: IRC channels and groups like CyberArmy where someone would post a working exploit and a thousand script kiddies would point it at anything that moved. Volume was the strategy because precision wasn't the point. Later, you work the other way. You know what you're looking for, and you construct the approach around that. Patience over volume. The target before the method. The people at the apex of that progression now are state-sponsored, resourced, and invisible until they choose not to be. The distance between a teenager on an IRC channel and an APT group is not as large as most people assume — it's the same curiosity, the same methodology, just with better funding and higher stakes. That trajectory is the distance between where this started and where it is now.</p>
    </section>


</main>

</body>
</html>
