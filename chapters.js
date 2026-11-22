/* chapters.js – shared chapter list: sidebar chapter menu, contents page */
(function () {
    /* Titles are plain text (inserted with textContent), so write "&", not "&amp;".
       Write titles without numbers: the sidebar menu adds "N. " from each chapter's position.
       The third field is the one-line description shown under the title on the contents page. */
    var chapters = [
        ['01-introduction.html', 'Introduction', 'Scope, key design principle, independence, disclaimer and glossary of abbreviations.'],
        ['02-conveyor-belts-and-grades.html', 'Conveyor Belts and Grades', 'Carcass constructions and selection, cover grades, cover thickness and tolerances.'],
        ['03-belt-capacities-and-material-properties.html', 'Belt Capacities and Material Properties', 'Bulk material properties, lump size, belt speed and capacity calculations.'],
        ['04-belt-power-and-tensions.html', 'Belt Power and Tensions', 'Conveyor resistances, effective tension, drive power and the slip limit.'],
        ['05-belt-manufacturing.html', 'Belt Manufacturing', 'How fabric, solid woven, steel cord and TPU belts are made and tested.'],
        ['06-belt-mass-roll-sizes-and-storage.html', 'Belt Mass, Roll Sizes and Storage', 'Belt mass and thickness, roll sizes, lifting, storage and inspection.'],
        ['07-belt-splicing.html', 'Belt Splicing', 'Hot and cold vulcanised, finger and steel cord splices, inspection and repair.'],
        ['08-belt-and-conveyor-monitoring.html', 'Belt and Conveyor Monitoring', 'Safety switches, weighing, rip and wear detection, scanning and digital twins.'],
        ['09-conveyor-commissioning-tracking-and-maintenance.html', 'Conveyor Commissioning, Tracking and Maintenance', 'Alignment, belt installation, drive and safety commissioning, tracking and handover.'],
        ['10-tensioning-and-take-up-systems.html', 'Tensioning and Take-Up Systems', 'Belt elongation, take-up types and selection, and minimum take-up travel.'],
        ['11-transfer-points-belt-cleaning-and-skirting.html', 'Transfer Points, Belt Cleaning, and Skirting', 'Chute design and trajectories, skirting, belt cleaners and dust control.'],
        ['12-intermediate-conveyor-drives-and-trippers.html', 'Intermediate Conveyor Drives and Trippers', 'Tension distribution, tripper and booster drives, placement and control.'],
        ['13-feeder-hopper-and-bin-design.html', 'Feeder, Hopper and Bin Design', 'Feeder types, mass and funnel flow, wall angles, liners and flow aids.'],
        ['14-horizontal-and-vertical-curves-and-transitions.html', 'Horizontal and Vertical Curves and Transitions', 'Convex and concave curves, horizontal curve radius and transition distances.'],
        ['15-fire-detection-and-suppression-systems.html', 'Fire Detection and Suppression Systems', 'Fire prevention, CO, smoke and heat detection, deluge and gas suppression.'],
        ['16-conveyor-availability-and-reliability.html', 'Conveyor Availability and Reliability', 'Failure modelling, downtime cost, life cycle cost, FMEA, RCM and spares.'],
        ['17-conveyor-drives-and-gearboxes.html', 'Conveyor Drives and Gearboxes', 'Gearbox types, mounting, service and thermal ratings, lubrication and failures.'],
        ['18-conveyor-electric-motors.html', 'Conveyor Electric Motors', 'Motor types, efficiency classes, IP ratings, hazardous areas and protection.'],
        ['19-conveyor-starting-methods-and-control.html', 'Conveyor Starting Methods and Control', 'Starting methods, control networks, start sequences and load sharing.'],
        ['20-deceleration-braking-and-anti-runback.html', 'Deceleration, Braking, and Anti-Runback', 'Coasting, brakes, anti-runback devices, regenerative conveyors and stopping.'],
        ['21-idler-engineering.html', 'Idler Engineering', 'Idler load ratings, bearings, seals, shells, spacing, tolerances and QA.'],
        ['22-pulley-engineering.html', 'Pulley Engineering', 'Pulley diameters, crowning, lagging, shafts, locking assemblies and bearings.']
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
            var text = span('chapter-text', '');
            text.appendChild(span('chapter-title', ch[1]));
            if (ch[2]) { text.appendChild(span('chapter-desc', ch[2])); }
            a.appendChild(text);
            li.appendChild(a);
            index.appendChild(li);
        });
    }
})();
