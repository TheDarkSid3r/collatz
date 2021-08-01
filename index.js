window.addEventListener("load", () => {
    const conject = n => n % 2 ? n * 3 + 1 : n / 2;
    const conjecture = i => {
        let n = Math.max(Math.round(i), 1);
        const result = [n];
        do result.push(n = conject(n));
        while (n > 1);
        return result;
    };

    const getFontSize = n => {
        const l = n.toString().length;
        switch (l) {
            case 1:
            case 2:
                return 40;
            case 3:
                return 30;
            case 4:
                return 25;
            default:
                return Math.max(20 - 2 * (l - 5), 8);
        }
    };

    const offset = e => {
        if (!e) return false;
        return { x: e.offsetLeft, y: e.offsetTop };
    };

    const wrapper = document.querySelector(".wrapper");
    const svg = document.querySelector(".output-svg");
    const output = document.querySelector(".output-main");

    let updateLines = null;

    const displayConjecture = inp => {
        svg.innerHTML = "";
        output.innerHTML = "";
        if (!inp) return;

        const points = conjecture(inp);
        const scale = Math.min(20 / points.length, 1);
        const transform = `translate(-50%, -50%) scale(${scale})`;
        const strokeWidth = `${scale * 10}px`;
        const min = Math.min(...points);
        const range = Math.max(...points) - min;
        const elements = points.map((n, i) => {
            const point = document.createElement("div");
            point.className = "point";
            point.innerText = n;
            point.style.left = `${i / (points.length - 1) * 100}%`;
            point.style.top = `${(1 - (n - min) / range) * 100}%`;
            point.style.transform = transform;
            point.style.fontSize = `${getFontSize(n)}px`;
            const clicker = document.createElement("div");
            clicker.className = "clicker";
            let tooltip = null;
            const move = e => {
                if (tooltip != null) {
                    tooltip.style.left = `${e.clientX}px`;
                    tooltip.style.top = `${e.clientY}px`;
                }
            };
            const exit = () => {
                if (tooltip != null) wrapper.removeChild(tooltip);
                tooltip = null;
            };
            const enter = e => {
                exit();
                tooltip = document.createElement("div");
                tooltip.className = "tooltip";
                tooltip.innerText = n.toLocaleString();
                wrapper.appendChild(tooltip);
                move(e);
            };
            clicker.addEventListener("mouseenter", enter);
            clicker.addEventListener("mouseleave", exit);
            clicker.addEventListener("mousemove", move);
            point.appendChild(clicker);
            output.appendChild(point);
            return point;
        });
        updateLines = () => elements.forEach((e, i) => {
            const p2 = offset(elements[i + 1]);
            if (p2) {
                const p1 = offset(e);
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", p1.x);
                line.setAttribute("y1", p1.y);
                line.setAttribute("x2", p2.x);
                line.setAttribute("y2", p2.y);
                line.setAttribute("stroke", "#333");
                line.setAttribute("stroke-width", strokeWidth);
                //line.setAttribute("stroke-linecap", "round");
                svg.appendChild(line);
            }
        });
        updateLines();
    };

    window.addEventListener("resize", () => {
        svg.innerHTML = "";
        if (updateLines) updateLines();
    });

    const input = document.querySelector(".input");
    input.addEventListener("input", () => displayConjecture(input.value));

    //displayConjecture(12);
});