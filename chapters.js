/* chapters.js – shared chapter list: sidebar chapter menu, contents page */
(function () {
    /* Titles are plain text (inserted with textContent), so write "&", not "&amp;".
       Write titles without numbers: the sidebar menu adds "N. " from each chapter's position. */
    var chapters = [
        ['01-introduction.html', 'Introduction'],
        ['02-conveyor-belts-and-grades.html', 'Conveyor Belts and Grades'],
        ['03-belt-capacities-and-material-properties.html', 'Belt Capacities and Material Properties'],
        ['04-belt-power-and-tensions.html', 'Belt Power and Tensions'],
        ['05-belt-manufacturing.html', 'Belt Manufacturing'],
        ['06-belt-mass-roll-sizes-and-storage.html', 'Belt Mass, Roll Sizes and Storage'],
        ['07-belt-splicing.html', 'Belt Splicing'],
        ['08-belt-and-conveyor-monitoring.html', 'Belt and Conveyor Monitoring'],
        ['09-conveyor-commissioning-tracking-and-maintenance.html', 'Conveyor Commissioning, Tracking and Maintenance'],
        ['10-tensioning-and-take-up-systems.html', 'Tensioning and Take-Up Systems'],
        ['11-transfer-points-belt-cleaning-and-skirting.html', 'Transfer Points, Belt Cleaning, and Skirting'],
        ['12-intermediate-conveyor-drives-and-trippers.html', 'Intermediate Conveyor Drives and Trippers'],
        ['13-feeder-hopper-and-bin-design.html', 'Feeder, Hopper and Bin Design'],
        ['14-horizontal-and-vertical-curves-and-transitions.html', 'Horizontal and Vertical Curves and Transitions'],
        ['15-fire-detection-and-suppression-systems.html', 'Fire Detection and Suppression Systems'],
        ['16-conveyor-availability-and-reliability.html', 'Conveyor Availability and Reliability'],
        ['17-conveyor-drives-and-gearboxes.html', 'Conveyor Drives and Gearboxes'],
        ['18-conveyor-electric-motors.html', 'Conveyor Electric Motors'],
        ['19-conveyor-starting-methods-and-control.html', 'Conveyor Starting Methods and Control'],
        ['20-deceleration-braking-and-anti-runback.html', 'Deceleration, Braking, and Anti-Runback'],
        ['21-idler-engineering.html', 'Idler Engineering'],
        ['22-pulley-engineering.html', 'Pulley Engineering']
    ];

    /* "chapter04.html", "chapter04" (clean URLs) and "/" all resolve sensibly */
    function pageName(path) {
        var name = path.split('/').pop() || 'index';
        return name.replace(/\.html?$/i, '') || 'index';
    }

    var current = pageName(location.pathname);
    var currentIndex = -1;
    for (var i = 0; i < chapters.length; i++) {
        if (pageName(chapters[i][0]) === current) { currentIndex = i; }
    }

    function span(className, text) {
        var s = document.createElement('span');
        s.className = className;
        s.textContent = text;
        return s;
    }

    /* ── Sidebar chapter menu ── */
    var menu = document.getElementById('chapterMenu');
    if (menu) {
        chapters.forEach(function (ch, i) {
            var a = document.createElement('a');
            a.href = ch[0];
            a.textContent = (i + 1) + '. ' + ch[1];
            if (i === currentIndex) {
                a.className = 'chapter-active';
                a.setAttribute('aria-current', 'page');
            }
            menu.appendChild(a);
        });
    }

    /* ── Contents list on the handbook landing page ──
       index.html carries the list as static links (for search engines and no-script readers);
       it is only built here if the page has none. */
    var index = document.getElementById('chapterIndex');
    if (index && !index.children.length) {
        chapters.forEach(function (ch, i) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = ch[0];
            a.appendChild(span('chapter-num', 'Chapter ' + (i + 1)));
            a.appendChild(span('chapter-title', ch[1]));
            li.appendChild(a);
            index.appendChild(li);
        });
    }
})();
