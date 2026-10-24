/* ==========================================================================
   Clover-X site widgets
   1. Gabber notification pop-up (invites visitors to the Gabber page)
   2. CloverBot: a chat assistant that answers ONLY from this website's content.

   Everything runs in the visitor's browser. Nothing is sent to a server or an
   AI service, so it works on GitHub Pages and on clover-x.in with no setup.
   To change an answer, edit the KNOWLEDGE list below.
   ========================================================================== */
(function () {
  'use strict';

  var BOT_NAME = 'CloverBot';
  var EMAIL = 'info@clover-x.in';

  // Site root, worked out from this script's own address, so links work from any page.
  var script = document.currentScript;
  var ROOT = script ? script.src.replace(/assets\/js\/widgets\.js.*$/, '') : '/';
  var onGabberPage = /\/projects\/gabber\.html/.test(location.pathname);

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  var ICON = {
    chat: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 12.5a7.5 7.5 0 0 1-10.9 6.7L4 20.5l1.3-4.6A7.5 7.5 0 1 1 20 12.5Z"/><path d="M9 11h6M9 14h4"/></svg>',
    close: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    send: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4.5 12h15M13.5 6l6 6-6 6"/></svg>'
  };

  /* ------------------------------------------------------------------------
     1. GABBER NOTIFICATION
     Shows once, a few seconds after the page loads (not on the Gabber page).
     Closing it is remembered on this device so it does not keep coming back.
     ------------------------------------------------------------------------ */
  var NOTICE_KEY = 'cx-gabber-notice-closed';
  if (!onGabberPage && !store(NOTICE_KEY)) {
    setTimeout(function () {
      var toast = el('aside', { 'class': 'cx-toast', role: 'status', 'aria-label': 'New from Clover-X' },
        '<img src="' + ROOT + 'assets/img/projects/gabber/gabber-icon.svg" alt="" width="44" height="44">' +
        '<div class="cx-toast-body">' +
          '<p class="cx-toast-label">New · Android beta</p>' +
          '<p class="cx-toast-title">Meet Gabber</p>' +
          '<p class="cx-toast-text">Chat, call and discover local businesses in one app made in India.</p>' +
          '<a class="btn btn-primary btn-sm" href="' + ROOT + 'projects/gabber.html">See Gabber</a>' +
        '</div>' +
        '<button class="cx-toast-close" type="button" aria-label="Close notification">' + ICON.close + '</button>');
      document.body.appendChild(toast);
      requestAnimationFrame(function () { toast.classList.add('is-in'); });
      var close = function () {
        store(NOTICE_KEY, '1');
        toast.classList.remove('is-in');
        setTimeout(function () { toast.remove(); }, 300);
      };
      toast.querySelector('.cx-toast-close').addEventListener('click', close);
      toast.querySelector('a').addEventListener('click', function () { store(NOTICE_KEY, '1'); });
    }, 4500); // after the 2-second loader, once the visitor has seen the page
  }

  /* ------------------------------------------------------------------------
     2. CLOVERBOT KNOWLEDGE BASE
     Every answer below comes from the Clover-X website.
     keys: words or short phrases that trigger the answer.
     {root} in an answer is replaced by the site address.
     ------------------------------------------------------------------------ */
  var KNOWLEDGE = [
    { keys: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening', 'hii', 'helo'],
      a: 'Hi! I\'m ' + BOT_NAME + ', the Clover-X assistant. Ask me about our services, the team, our projects, the Gabber app, or how to contact us.' },
    { keys: ['who are you', 'what are you', 'bot', 'chatbot', 'ai', 'human', 'real person'],
      a: 'I\'m ' + BOT_NAME + ', a simple assistant that answers only from the Clover-X website. I don\'t use outside AI and your messages are not sent anywhere. For anything else, <a href="{root}#contact">message our team</a>.' },
    { keys: ['clover-x', 'clover x', 'cloverx', 'your company', 'the company', 'about clover', 'about your company', 'what do you do', 'who is clover'],
      a: 'Clover-X is a technology partner for small and mid-size businesses, based in Gujarat, India. One team covers <strong>Security, Web Apps, Software and Communication Technology</strong>, so you have a single partner who understands how it all fits together. <a href="{root}#services">See our services</a>.' },

    { keys: ['services', 'service', 'offer', 'provide', 'help with', 'what can you do', 'solutions'],
      a: 'We offer four services:<ul><li><strong>Security</strong>: assessments, penetration testing, hardening, monitoring &amp; incident response</li><li><strong>Web Apps</strong>: custom web apps, portals &amp; dashboards, APIs, websites &amp; e-commerce</li><li><strong>Software</strong>: custom software, desktop &amp; mobile apps, automation, modernization</li><li><strong>Communication Technology</strong>: VoIP, collaboration platforms, networks, video conferencing &amp; contact centers</li></ul><a href="{root}#services">Read more</a>' },
    { keys: ['security', 'cybersecurity', 'audit', 'assessment', 'penetration', 'pentest', 'pentesting', 'pen test', 'pen testing', 'ethical hacking', 'hardening', 'incident', 'monitoring', 'vulnerability', 'hacked', 'firewall'],
      a: '<strong>Security</strong>: find the gaps before someone else does, and close them for good. We offer security assessments and audits, penetration testing, secure architecture and hardening, and monitoring and incident response. <a href="{root}#service-security">Security service</a>' },
    { keys: ['web app', 'web apps', 'website', 'web site', 'portal', 'dashboard', 'api', 'apis', 'integration', 'ecommerce', 'e-commerce', 'online shop', 'web development'],
      a: '<strong>Web Apps</strong>: web tools your customers and staff actually enjoy using. We build custom web applications, portals and dashboards, APIs and integrations, and websites and e-commerce. <a href="{root}#service-web-apps">Web Apps service</a>' },
    { keys: ['software', 'custom software', 'desktop', 'mobile app', 'android app', 'automation', 'internal tools', 'maintenance', 'modernization', 'modernisation', 'legacy'],
      a: '<strong>Software</strong>: software shaped around how your business really works. Custom software, desktop and mobile apps, automation and internal tools, and maintenance and modernization. <a href="{root}#service-software">Software service</a>' },
    { keys: ['communication', 'voip', 'phone system', 'telephony', 'unified communications', 'collaboration', 'network', 'connectivity', 'wifi', 'video conferencing', 'contact center', 'call center', 'messaging platform'],
      a: '<strong>Communication Technology</strong>: clear calls, reliable networks and teams that stay connected. VoIP and unified communications, messaging and collaboration platforms, network and connectivity design, and video conferencing and contact-center setup. <a href="{root}#service-communication">Communication service</a>' },

    { keys: ['why', 'why choose', 'different', 'principles', 'benefits', 'advantage', 'trust you'],
      a: 'Our principles:<ul><li><strong>Security by default</strong>: security is in the plan from the start</li><li><strong>One team across the stack</strong>: nothing falls between vendors</li><li><strong>Built to scale</strong>: tools that grow with you</li><li><strong>Plain-language communication</strong>: clear updates, honest estimates, no jargon</li></ul><a href="{root}#why">Why Clover-X</a>' },
    { keys: ['process', 'how do you work', 'how you work', 'steps', 'approach', 'methodology', 'timeline', 'how long', 'start a project', 'onboarding'],
      a: 'We work in four steps:<ol><li><strong>Discover</strong>: how your business runs and where the risks are</li><li><strong>Design</strong>: a clear plan with scope, timeline and cost before work begins</li><li><strong>Build</strong>: small, visible steps you can review</li><li><strong>Support</strong>: we monitor, maintain and improve after launch</li></ol><a href="{root}#process">Our process</a>' },
    { keys: ['price', 'pricing', 'cost', 'quote', 'quotation', 'rate', 'rates', 'fees', 'budget', 'how much', 'charges', 'estimate'],
      a: 'Prices aren\'t listed on the website because every project is different. In our <strong>Design</strong> step we propose a clear plan with scope, timeline and cost before any work begins. <a href="{root}#contact">Ask for a quote</a> and we\'ll reply within two business days.' },

    { keys: ['team', 'who works', 'people', 'members', 'staff', 'employees', 'founder', 'founders', 'experts'],
      a: 'The Clover-X team:<ul><li><a href="{root}portfolio/aman-varma.html">Aman Varma</a>: Identity &amp; Access Management (Entra ID, IAM, Zero Trust)</li><li><a href="{root}portfolio/nihar-mehta.html">Nihar Mehta</a>: Security Analyst, SOC &amp; threat detection (SIEM, incident response, SOAR)</li></ul><a href="{root}team.html">Meet the team</a>' },
    { keys: ['aman', 'varma', 'aman varma', 'iam', 'identity', 'access management', 'entra', 'entra id', 'azure ad', 'zero trust', 'conditional access', 'pim', 'sc-300', 'sc300'],
      a: '<strong>Aman Varma</strong> works on Identity &amp; Access Management: Microsoft Entra ID, identity lifecycle (JML), access reviews, entitlement management, Conditional Access and PIM. He is SC-300 certified and studying an M.Sc. in Computer Science (Cybersecurity, IAM). Projects include AccessPilot and PhishIntel Analyzer. <a href="{root}portfolio/aman-varma.html">View Aman\'s portfolio</a>' },
    { keys: ['nihar', 'mehta', 'nihar mehta', 'soc', 'siem', 'splunk', 'wazuh', 'threat detection', 'forensics', 'security analyst', 'soar', 'ceh'],
      a: '<strong>Nihar Mehta</strong> is a Security Analyst focused on threat detection, incident response and digital forensics, with an M.Sc. in Cybersecurity &amp; Forensics. Projects include SafeLine WAF, NetSentinel IDS/IPS and a Mini SOAR platform. <a href="{root}portfolio/nihar-mehta.html">View Nihar\'s portfolio</a>' },
    { keys: ['certification', 'certifications', 'certified', 'certificate', 'qualified', 'qualifications'],
      a: 'Team certifications include <strong>Microsoft SC-300</strong> (Identity and Access Administrator), <strong>EC-Council Certified Security Analyst</strong>, IBM Security Operation Center and Cybersecurity Architecture, Cisco Ethical Hacker and Junior Cybersecurity Analyst, and CompTIA ITF+. See the <a href="{root}portfolio/aman-varma.html">Aman</a> and <a href="{root}portfolio/nihar-mehta.html">Nihar</a> portfolios.' },
    { keys: ['technology', 'technologies', 'tech stack', 'tools', 'skills', 'python', 'react', 'powershell', 'azure', 'aws', 'docker', 'languages'],
      a: 'Our team works with Microsoft Entra ID, Active Directory and Microsoft 365, SAML / OAuth 2.0 / OpenID Connect, Python, FastAPI, Flask, React and TypeScript, PostgreSQL, PowerShell and Microsoft Graph, SIEM tools like Splunk and Wazuh, n8n and Shuffle for automation, and AWS, GCP and Azure security. Details are on each <a href="{root}team.html">team portfolio</a>.' },

    { keys: ['projects', 'project', 'portfolio', 'your work', 'case study', 'case studies', 'examples', 'built', 'previous work'],
      a: 'Featured product: <a href="{root}projects/gabber.html">Gabber</a>. Team projects:<ul><li>AccessPilot: identity governance platform</li><li>SafeLine WAF on a bare-metal hypervisor</li><li>NetSentinel: IDS/IPS with machine learning</li><li>PhishIntel Analyzer</li><li>Mini SOAR platform with n8n</li><li>IoT traffic analysis (MQTT)</li></ul><a href="{root}#work">See all projects</a>' },
    { keys: ['accesspilot', 'access pilot', 'iga', 'identity governance'],
      a: '<strong>AccessPilot</strong> is an identity governance (IGA) platform over Entra ID, Okta and Active Directory that controls who has access to what, for how long and under whose approval. Built with Python/FastAPI, PostgreSQL and React. <a href="{root}portfolio/aman-varma.html">Read the case study</a>' },
    { keys: ['phishintel', 'phishing', 'phish', 'email security', 'eml'],
      a: '<strong>PhishIntel Analyzer</strong> is a web app that analyses phishing .eml files using an NLP model, heuristics and threat-intelligence lookups. <a href="{root}portfolio/aman-varma.html">Read the case study</a>' },
    { keys: ['logsentinel', 'log analysis', 'logs'],
      a: '<strong>LogSentinel</strong> is a log analysis platform that helps small businesses monitor server and authentication logs and spot suspicious activity. <a href="{root}portfolio/aman-varma.html">Read more</a>' },
    { keys: ['safeline', 'waf', 'web application firewall', 'modsecurity', 'hypervisor', 'kvm'],
      a: '<strong>SafeLine WAF</strong> is a web application firewall running as its own security VM on a KVM/QEMU hypervisor, with NGINX, ModSecurity and the OWASP Core Rule Set. It blocks SQL injection, XSS, path traversal and DoS traffic. <a href="{root}portfolio/nihar-mehta.html">Read the case study</a>' },
    { keys: ['netsentinel', 'ids', 'ips', 'intrusion', 'machine learning', 'anomaly'],
      a: '<strong>NetSentinel</strong> is a lightweight intrusion detection and prevention system combining signature rules with machine-learning anomaly detection (Isolation Forest), with real-time alerts and a dashboard. <a href="{root}portfolio/nihar-mehta.html">Read the case study</a>' },
    { keys: ['n8n', 'mini soar', 'shuffle', 'playbook', 'playbooks', 'automated response', 'virustotal', 'abuseipdb'],
      a: 'Our security automation work includes a <strong>Mini SOAR platform with n8n</strong>, which enriches an alert with VirusTotal and AbuseIPDB, scores the risk and blocks dangerous IPs in about four seconds, plus <strong>Shuffle SOAR playbooks</strong> connecting Wazuh, MISP and TheHive. <a href="{root}portfolio/nihar-mehta.html">Read more</a>' },
    { keys: ['iot', 'mqtt', 'wireshark', 'traffic analysis'],
      a: 'The <strong>IoT traffic analysis</strong> case study captured MQTT traffic between simulated IoT devices and a broker in Wireshark, showing unencrypted messages and the defences: MQTT over TLS, broker authentication and topic audits. <a href="{root}portfolio/nihar-mehta.html">Read more</a>' },

    { keys: ['gabber', 'gabber app', 'your app', 'chat app', 'product', 'messaging app'],
      a: '<strong>Gabber</strong> (Chat. Call. Discover.) is our Android app, made in India. It brings messaging, voice and video calls, groups, status updates and local business discovery into one place. <a href="{root}projects/gabber.html">See Gabber</a>' },
    { keys: ['gabber features', 'features', 'draw together', 'video call', 'voice call', 'group call', 'status', 'voice notes', 'explore nearby', 'nearby'],
      a: 'Gabber features: <strong>chat</strong> (1:1 and groups, voice notes, media, status), <strong>voice and video calls</strong> including group calls with <strong>Draw together</strong> (sketch live on everyone\'s screen), and <strong>Explore nearby</strong> to find restaurants, shops, hotels and services within 5–50 km. <a href="{root}projects/gabber.html">See Gabber</a>' },
    { keys: ['gabber business', 'list my business', 'my business', 'register business', 'business listing', 'list', 'listing', 'restaurant', 'hotel', 'register', 'verified', 'verification', 'gst', 'payments', 'pay', 'orders', 'customers'],
      a: '<strong>Gabber for Business</strong> lets nearby customers find you first: be discoverable when people explore nearby, submit your details (GST optional) for the verified badge, and serve customers in chat, including orders and secure in-chat payments. <a href="{root}projects/gabber.html#early-access">Request early access</a>' },
    { keys: ['download', 'install', 'beta', 'early access', 'play store', 'google play', 'apk', 'release', 'launch', 'when', 'available', 'join'],
      a: 'Gabber is being prepared for <strong>Android beta testing</strong>. The official download link will be published on the Gabber page when the signed build is ready; please never install Gabber from an unofficial link. <a href="{root}projects/gabber.html#early-access">Request early access</a> and we\'ll email your invite.' },
    { keys: ['iphone', 'ios', 'apple', 'ipad', 'on iphone', 'gabber iphone', 'gabber ios', 'on ios'],
      a: 'The website only mentions <strong>Android</strong> for Gabber (currently in beta). For other platforms, <a href="{root}#contact">ask our team</a>.' },

    { keys: ['contact', 'reach', 'email', 'mail', 'talk', 'get in touch', 'message you', 'call you', 'phone number', 'whatsapp', 'enquiry', 'inquiry'],
      a: 'You can email us at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> or use the <a href="{root}#contact">contact form</a>. We reply within two business days with next steps: no obligation, no sales pitch.' },
    { keys: ['where', 'location', 'located', 'address', 'office', 'gujarat', 'india', 'city'],
      a: 'Clover-X is based in <strong>Gujarat, India</strong>. Contact: <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.' },
    { keys: ['privacy', 'data', 'cookies', 'cookie', 'gdpr', 'dpdp', 'personal data', 'tracking'],
      a: 'This website uses <strong>no cookies, analytics or tracking</strong>. We only collect what you send through our forms, to reply to you. Your chat with me stays in your browser. <a href="{root}privacy.html">Privacy policy</a>' },
    { keys: ['legal', 'legal notice', 'terms', 'imprint', 'disclaimer', 'copyright'],
      a: 'You\'ll find operator details, disclaimers and governing law in our <a href="{root}imprint.html">legal notice</a>, and how we handle data in the <a href="{root}privacy.html">privacy policy</a>.' },
    { keys: ['job', 'jobs', 'career', 'careers', 'hiring', 'internship', 'vacancy', 'work with you', 'join your team'],
      a: 'The website doesn\'t list open positions at the moment. You can write to <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> to introduce yourself.' },
    { keys: ['thanks', 'thank you', 'thx', 'great', 'awesome', 'ok', 'okay', 'cool'],
      a: 'You\'re welcome! Anything else you\'d like to know about Clover-X?' },
    { keys: ['bye', 'goodbye', 'see you'],
      a: 'Thanks for visiting Clover-X. Have a great day!' }
  ];

  var FALLBACK = 'I can only answer questions using the Clover-X website, and I couldn\'t find that here. Try asking about our <strong>services</strong>, <strong>team</strong>, <strong>projects</strong> or <strong>Gabber</strong>, or <a href="{root}#contact">message our team</a> and we\'ll reply within two business days.';
  var SUGGESTIONS = ['What services do you offer?', 'Who is on the team?', 'What is Gabber?', 'How do I contact you?'];

  /* ---- Matching: keyword and phrase scoring with small typo tolerance ---- */
  var STOP = { a:1, an:1, the:1, is:1, are:1, do:1, does:1, you:1, your:1, i:1, me:1, my:1, we:1, our:1, of:1, to:1, in:1, on:1, for:1, and:1, or:1, can:1, what:1, how:1, who:1, please:1, tell:1, about:1, it:1, this:1, that:1, with:1, be:1, have:1, has:1, any:1, there:1 };
  function norm(t) { return (' ' + t.toLowerCase().replace(/[^a-z0-9ऀ-ॿ@.\- ]+/g, ' ').replace(/\s+/g, ' ') + ' '); }
  function close1(a, b) { // edit distance <= 1
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  }
  function answer(question) {
    var q = norm(question);
    var words = q.trim().split(' ').filter(function (w) { return w && !STOP[w]; });
    var best = null, bestScore = 0;
    KNOWLEDGE.forEach(function (item, idx) {
      var score = 0;
      item.keys.forEach(function (k) {
        var key = k.toLowerCase();
        if (key.indexOf(' ') > -1) { if (q.indexOf(' ' + key + ' ') > -1) score += 2.5; return; }
        if (q.indexOf(' ' + key + ' ') > -1) { score += 1.5; return; }
        if (key.length >= 5) words.forEach(function (w) { if (w.length >= 4 && (close1(w, key) || (w.length >= 5 && (key.indexOf(w) === 0 || w.indexOf(key) === 0)))) score += 0.8; });
      });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return (best && bestScore >= 1 ? best.a : FALLBACK).replace(/\{root\}/g, ROOT);
  }

  /* ------------------------------------------------------------------------
     CLOVERBOT USER INTERFACE
     ------------------------------------------------------------------------ */
  var launcher = el('button', { 'class': 'cx-bot-launcher', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'cx-bot', 'aria-label': 'Chat with ' + BOT_NAME },
    ICON.chat + '<span class="cx-bot-launcher-text">Ask ' + BOT_NAME + '</span>');
  var panel = el('section', { 'class': 'cx-bot', id: 'cx-bot', role: 'dialog', 'aria-label': BOT_NAME + ' chat', hidden: '' },
    '<header class="cx-bot-head">' +
      '<span class="cx-bot-avatar" aria-hidden="true"><img src="' + ROOT + 'assets/img/brand/clover-x-mark-white.svg" alt="" width="24" height="23"></span>' +
      '<div><p class="cx-bot-name">' + BOT_NAME + '</p><p class="cx-bot-sub">Answers from the Clover-X website</p></div>' +
      '<button class="cx-bot-close" type="button" aria-label="Close chat">' + ICON.close + '</button>' +
    '</header>' +
    '<div class="cx-bot-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
    '<div class="cx-bot-suggest"></div>' +
    '<form class="cx-bot-form">' +
      '<label class="visually-hidden" for="cx-bot-input">Your question</label>' +
      '<input id="cx-bot-input" type="text" autocomplete="off" maxlength="200" placeholder="Ask about services, team, Gabber…">' +
      '<button class="cx-bot-send" type="submit" aria-label="Send">' + ICON.send + '</button>' +
    '</form>' +
    '<p class="cx-bot-note">Your chat stays in your browser and is not saved.</p>');
  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var log = panel.querySelector('.cx-bot-log');
  var input = panel.querySelector('input');
  var suggest = panel.querySelector('.cx-bot-suggest');
  var started = false;

  function add(who, html) {
    var msg = el('div', { 'class': 'cx-msg cx-msg-' + who }, html);
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  }
  function reply(question) {
    var typing = add('bot', '<span class="cx-typing" aria-label="' + BOT_NAME + ' is typing"><i></i><i></i><i></i></span>');
    setTimeout(function () { typing.innerHTML = answer(question); log.scrollTop = log.scrollHeight; }, 450);
  }
  function ask(text) {
    text = text.trim();
    if (!text) return;
    var safe = document.createElement('div'); safe.textContent = text;
    add('user', safe.innerHTML);
    reply(text);
  }
  SUGGESTIONS.forEach(function (s) {
    var b = el('button', { type: 'button', 'class': 'cx-chip' }, s);
    b.addEventListener('click', function () { ask(s); input.focus(); });
    suggest.appendChild(b);
  });

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('cx-bot-open', open);
    if (open) {
      if (!started) {
        started = true;
        add('bot', 'Hi! I\'m <strong>' + BOT_NAME + '</strong>. I can answer questions about Clover-X using our website: services, team, projects and the Gabber app. How can I help?');
      }
      var toast = document.querySelector('.cx-toast'); if (toast) toast.remove();
      setTimeout(function () { input.focus(); }, 50);
    } else {
      launcher.focus();
    }
  }
  launcher.addEventListener('click', function () { setOpen(panel.hidden); });
  panel.querySelector('.cx-bot-close').addEventListener('click', function () { setOpen(false); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  panel.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    ask(input.value);
    input.value = '';
  });
  // Links inside answers that point to this page's sections: close the chat so the section is visible.
  log.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || !a.hash || a.pathname !== location.pathname) return;
    setOpen(false);
    var target = document.getElementById(a.hash.slice(1));
    if (target && target.tagName === 'DIALOG' && typeof target.showModal === 'function') {
      e.preventDefault();
      target.showModal();
    }
  });
})();
