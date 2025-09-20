class Heatmap {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('tooltip');

        this.options = {
            width: options.width || 800,
            height: options.height || 300,
            rows: 7, // 7 days of week
            cols: options.cols || 52, // 52 weeks in a year
            padding: options.padding || 2,
            colorMap: options.colorMap || this.getDefaultColorMap(),
            labelPadding: 60, // Space for labels
            ...options
        };

        this.weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        this.weekdayLabels = ['', '周二', '', '周四', '', '周六', '']; // Only show specific days

        this.data = [];
        this.cellWidth = 0;
        this.cellHeight = 0;

        this.init();
        this.generateRandomData();
        this.render();
        this.bindEvents();
    }

    init() {
        this.canvas.width = this.options.width + this.options.labelPadding;
        this.canvas.height = this.options.height + this.options.labelPadding;

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

        // Draw weekday labels (Y-axis) - only show specific days
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i < this.options.rows; i++) {
            if (this.weekdayLabels[i]) { // Only draw non-empty labels
                const y = i * (this.cellHeight + this.options.padding) + this.options.padding + this.cellHeight / 2 + this.options.labelPadding;
                this.ctx.fillText(this.weekdayLabels[i], this.options.labelPadding - 10, y);
            }
        }

        // Draw month labels (X-axis) - show month at first week of each month
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        const monthStarts = [1, 5, 9, 14, 18, 22, 27, 31, 36, 40, 44, 49]; // Approximate week numbers for month starts

        for (let i = 0; i < monthStarts.length; i++) {
            const weekIndex = monthStarts[i] - 1;
            if (weekIndex < this.options.cols) {
                const x = weekIndex * (this.cellWidth + this.options.padding) + this.options.padding + this.cellWidth / 2 + this.options.labelPadding;
                this.ctx.fillText(months[i], x, 10);
            }
        }

        // Draw heatmap cells
        for (let i = 0; i < this.options.rows; i++) {
            for (let j = 0; j < this.options.cols; j++) {
                const value = this.data[i][j];
                const color = this.valueToColor(value);

                const x = j * (this.cellWidth + this.options.padding) + this.options.padding + this.options.labelPadding;
                const y = i * (this.cellHeight + this.options.padding) + this.options.padding + this.options.labelPadding;

                this.ctx.fillStyle = color;
                this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight);

                this.ctx.strokeStyle = '#e0e0e0';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);
            }
        }
    }

    getCellFromCoordinates(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = x - rect.left - this.options.labelPadding;
        const canvasY = y - rect.top - this.options.labelPadding;

        const col = Math.floor(canvasX / (this.cellWidth + this.options.padding));
        const row = Math.floor(canvasY / (this.cellHeight + this.options.padding));

        if (row >= 0 && row < this.options.rows && col >= 0 && col < this.options.cols) {
            const weekday = this.weekdays[row];
            const week = col + 1;
            return { row, col, value: this.data[row][col], weekday, week };
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
                const content = `第${cell.week}周<br>${this.weekdays[cell.row]}<br>数值: ${cell.value.toFixed(3)}`;
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
        height: 300,
        cols: 52
    });

    // Birth date controls
    const birthYear = document.getElementById('birth-year');
    const birthMonth = document.getElementById('birth-month');
    const birthDay = document.getElementById('birth-day');

    // Populate year options (1900-2100)
    function populateYearOptions() {
        for (let year = 1900; year <= 2100; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + '年';
            if (year === 1990) option.selected = true; // Default selection
            birthYear.appendChild(option);
        }
    }

    // Populate day options based on selected year and month
    function populateDayOptions() {
        const year = parseInt(birthYear.value);
        const month = parseInt(birthMonth.value);
        const daysInMonth = new Date(year, month, 0).getDate();
        const currentDay = parseInt(birthDay.value) || 15;

        // Clear existing options
        birthDay.innerHTML = '';

        // Add new options
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day + '日';
            if (day === Math.min(currentDay, daysInMonth)) {
                option.selected = true;
            }
            birthDay.appendChild(option);
        }
    }

    // Load birth date from localStorage
    function loadBirthDate() {
        const savedBirthDate = localStorage.getItem('birthDate');
        if (savedBirthDate) {
            const { year, month, day } = JSON.parse(savedBirthDate);
            birthYear.value = year;
            birthMonth.value = month;
            populateDayOptions();
            birthDay.value = day;
        }
    }

    // Save birth date to localStorage
    function saveBirthDate() {
        const birthDate = {
            year: parseInt(birthYear.value),
            month: parseInt(birthMonth.value),
            day: parseInt(birthDay.value)
        };
        localStorage.setItem('birthDate', JSON.stringify(birthDate));
    }


    // Event listeners for birth date controls
    birthYear.addEventListener('change', () => {
        populateDayOptions();
        saveBirthDate();
    });

    birthMonth.addEventListener('change', () => {
        populateDayOptions();
        saveBirthDate();
    });

    birthDay.addEventListener('change', () => {
        saveBirthDate();
    });

    // Initialize birth date
    populateYearOptions();
    populateDayOptions();
    loadBirthDate();

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