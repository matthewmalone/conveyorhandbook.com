/* handbook.js – mobile sidebar, chapter and calculator menu toggles, scrollspy */
(function () {
    var sidebar = document.getElementById('sidebar');
    var sidebarToggle = document.getElementById('sidebarToggle');
    var sidebarClose = document.getElementById('sidebarClose');
    var backdrop = document.getElementById('sidebarBackdrop');
    var main = document.getElementById('main');
    var topbar = document.querySelector('.topbar');
    var mobileQuery = window.matchMedia('(max-width: 991.98px)');

    /* ── Mobile sidebar (off-canvas below 992px) ── */
    function setSidebar(open, returnFocus) {
        if (!sidebar) { return; }
        sidebar.classList.toggle('open', open);
        document.body.classList.toggle('sidebar-open', open);
        if (sidebarToggle) { sidebarToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); }
        if (backdrop) { backdrop.hidden = !open; }
        if (main) { main.inert = open; }
        if (open) {
            sidebar.focus();
        } else if (returnFocus && sidebarToggle) {
            sidebarToggle.focus();
        }
    }

    if (sidebar) {
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function () {
                setSidebar(!sidebar.classList.contains('open'));
            });
        }
        if (sidebarClose) {
            sidebarClose.addEventListener('click', function () { setSidebar(false, true); });
        }
        if (backdrop) {
            backdrop.addEventListener('click', function () { setSidebar(false, true); });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) { setSidebar(false, true); }
        });
        /* Tapping a chapter or section link closes the panel on small screens */
        sidebar.addEventListener('click', function (e) {
            if (mobileQuery.matches && e.target.closest('.toc a, .chapter-menu a')) { setSidebar(false); }
        });
        /* Rotating or resizing up to desktop width resets the panel */
        var onBreakpoint = function (e) { if (!e.matches) { setSidebar(false); } };
        if (mobileQuery.addEventListener) {
            mobileQuery.addEventListener('change', onBreakpoint);
        } else if (mobileQuery.addListener) {
            mobileQuery.addListener(onBreakpoint);
        }
    }

    /* ── Chapter and calculator menu toggles (closed by default; opening each is remembered) ── */
    [['chapterMenuBtn', 'chapterMenu', 'handbook.chapterMenu'], ['calcMenuBtn', 'calcMenu', 'handbook.calcMenu']].forEach(function (m) {
        var btn = document.getElementById(m[0]);
        var list = document.getElementById(m[1]);
        if (!btn || !list) { return; }
        var setMenu = function (open) {
            list.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        };
        var savedState = null;
        try { savedState = localStorage.getItem(m[2]); } catch (e) { /* storage unavailable: use the default */ }
        setMenu(savedState === 'open');

        btn.addEventListener('click', function () {
            var open = !list.classList.contains('open');
            setMenu(open);
            try { localStorage.setItem(m[2], open ? 'open' : 'closed'); } catch (e) { /* ignore */ }
        });
    });

    /* ── Scrollspy ── */
    var sections = document.querySelectorAll('section[id]');
    var tocLinks = document.querySelectorAll('.sidebar .toc a');
    if (sections.length && tocLinks.length) {
        var ticking = false;

        /* A clicked entry stays highlighted until the reader scrolls the page
           themselves. This covers headings near the top or bottom that can't be
           scrolled up to the top of the window, including when the page can't
           move at all because it is already at the end. */
        var lockedTarget = null;
        var lockSettled = false;
        var settleTimer = null;

        var isTocTarget = function (id) {
            for (var i = 0; i < tocLinks.length; i++) {
                if (tocLinks[i].getAttribute('href') === '#' + id) { return true; }
            }
            return false;
        };

        var setActive = function (id) {
            tocLinks.forEach(function (link) {
                var match = link.getAttribute('href') === '#' + id;
                link.classList.toggle('active', match);
                if (match) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        /* Allow for the sticky mobile top bar; must exceed the CSS scroll-margin-top */
        var spyOffset = function () {
            return 40 + (topbar ? topbar.offsetHeight : 0);
        };

        var updateActive = function () {
            ticking = false;
            if (lockedTarget !== null) {
                setActive(lockedTarget);
                return;
            }
            var current = '';
            var atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 2);
            if (atBottom) {
                current = sections[sections.length - 1].id;
            } else {
                var offset = spyOffset();
                sections.forEach(function (s) {
                    if (s.getBoundingClientRect().top <= offset) { current = s.id; }
                });
            }
            /* At the very top, before any heading has reached the top, show the first section */
            setActive(current || sections[0].id);
        };

        var requestUpdate = function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateActive);
            }
        };

        var settleAfter = function (ms) {
            clearTimeout(settleTimer);
            settleTimer = setTimeout(function () { lockSettled = true; }, ms);
        };

        var lockTo = function (id) {
            lockedTarget = id;
            lockSettled = false;
            settleAfter(300); /* if the page can't move, there are no scroll events to wait for */
            setActive(id);
        };

        var releaseLock = function () {
            if (lockedTarget === null) { return; }
            lockedTarget = null;
            clearTimeout(settleTimer);
            requestUpdate();
        };

        tocLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                lockTo(link.getAttribute('href').substring(1));
            });
        });

        /* Back/forward between sections, or a #link from elsewhere */
        window.addEventListener('hashchange', function () {
            var id = decodeURIComponent(location.hash.substring(1));
            if (id && isTocTarget(id)) { lockTo(id); }
        });

        window.addEventListener('scroll', function () {
            if (lockedTarget !== null) {
                if (lockSettled) {
                    releaseLock();   /* the click's own scroll has finished, so this one is the reader's */
                } else {
                    settleAfter(150); /* still the smooth scroll started by the click */
                }
                return;
            }
            requestUpdate();
        }, { passive: true });

        /* Wheel, touch-drag or keyboard scrolling of the page releases the highlight at once.
           Scrolling inside the sidebar's own list does not. */
        var onReaderScroll = function (e) {
            if (sidebar && sidebar.contains(e.target)) { return; }
            releaseLock();
        };
        window.addEventListener('wheel', onReaderScroll, { passive: true });
        window.addEventListener('touchmove', onReaderScroll, { passive: true });
        document.addEventListener('keydown', function (e) {
            if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key)) { releaseLock(); }
        });

        window.addEventListener('resize', requestUpdate);

        var initialId = decodeURIComponent(location.hash.substring(1));
        if (initialId && isTocTarget(initialId)) {
            lockTo(initialId);
        } else {
            updateActive();
        }
    }
})();
