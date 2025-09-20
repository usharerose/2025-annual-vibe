class Heatmap {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('tooltip');

        this.options = {
            width: options.width || 800,
            height: options.height || 500,
            rows: options.rows || 20,
            cols: options.cols || 30,
            padding: options.padding || 2,
            colorMap: options.colorMap || this.getDefaultColorMap(),
            ...options
        };

        this.data = [];
        this.cellWidth = 0;
        this.cellHeight = 0;

        this.init();
        this.generateRandomData();
        this.render();
        this.bindEvents();
    }

    init() {
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;

        this.cellWidth = (this.options.width - this.options.padding * (this.options.cols + 1)) / this.options.cols;
        this.cellHeight = (this.options.height - this.options.padding * (this.options.rows + 1)) / this.options.rows;
    }

    getDefaultColorMap() {
        return [
            '#F2B652', '#E8E284', '#ACE08C', '#54D99F', '#26C4A5'
        ];
    }

    generateRandomData() {
        this.data = [];
        for (let i = 0; i < this.options.rows; i++) {
            const row = [];
            for (let j = 0; j < this.options.cols; j++) {
                row.push(Math.random());
            }
            this.data.push(row);
        }
    }

    valueToColor(value) {
        const index = Math.floor(value * (this.options.colorMap.length - 1));
        return this.options.colorMap[Math.min(index, this.options.colorMap.length - 1)];
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.options.rows; i++) {
            for (let j = 0; j < this.options.cols; j++) {
                const value = this.data[i][j];
                const color = this.valueToColor(value);

                const x = j * (this.cellWidth + this.options.padding) + this.options.padding;
                const y = i * (this.cellHeight + this.options.padding) + this.options.padding;

                this.ctx.fillStyle = color;
                this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight);

                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);
            }
        }
    }

    getCellFromCoordinates(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;

        const col = Math.floor(canvasX / (this.cellWidth + this.options.padding));
        const row = Math.floor(canvasY / (this.cellHeight + this.options.padding));

        if (row >= 0 && row < this.options.rows && col >= 0 && col < this.options.cols) {
            return { row, col, value: this.data[row][col] };
        }
        return null;
    }

    showTooltip(x, y, content) {
        this.tooltip.innerHTML = content;
        this.tooltip.style.left = (x + 10) + 'px';
        this.tooltip.style.top = (y - 10) + 'px';
        this.tooltip.classList.add('show');
    }

    hideTooltip() {
        this.tooltip.classList.remove('show');
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const cell = this.getCellFromCoordinates(e.clientX, e.clientY);
            if (cell) {
                const content = `Row: ${cell.row}<br>Col: ${cell.col}<br>Value: ${cell.value.toFixed(3)}`;
                this.showTooltip(e.clientX, e.clientY, content);
            } else {
                this.hideTooltip();
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    updateData(newData) {
        this.data = newData;
        this.render();
    }

    regenerateData() {
        this.generateRandomData();
        this.render();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const heatmap = new Heatmap('heatmap-canvas', {
        width: 800,
        height: 500,
        rows: 20,
        cols: 30
    });

    const generateButton = document.getElementById('generate-data');
    generateButton.addEventListener('click', () => {
        heatmap.regenerateData();
    });

    window.addEventListener('resize', () => {
        const container = document.querySelector('.heatmap-wrapper');
        const maxWidth = container.clientWidth - 40;
        if (maxWidth < 800) {
            heatmap.canvas.style.width = maxWidth + 'px';
            heatmap.canvas.style.height = (maxWidth * 0.625) + 'px';
        }
    });
});