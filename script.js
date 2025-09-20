class FortuneCalculator {
    constructor(birthYear, birthMonth, birthDay) {
        this.birthYear = birthYear;
        this.birthMonth = birthMonth;
        this.birthDay = birthDay;
        this.birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    }

    // 计算生辰八字相关的基础数值
    calculateLifeNumber() {
        const sum = this.birthYear + this.birthMonth + this.birthDay;
        return sum % 9 + 1; // 1-9的生命数字
    }

    // 计算五行属性影响
    getElementScore(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // 简化的五行计算：金木水火土
        const elements = ['金', '木', '水', '火', '土'];
        const birthElement = elements[(this.birthYear + this.birthMonth + this.birthDay) % 5];
        const dayElement = elements[(year + month + day) % 5];

        // 五行相生相克关系
        const elementRelations = {
            '金': { '金': 50, '木': 30, '水': 80, '火': 20, '土': 70 },
            '木': { '金': 20, '木': 50, '水': 70, '火': 80, '土': 30 },
            '水': { '金': 70, '木': 80, '水': 50, '火': 30, '土': 20 },
            '火': { '金': 80, '木': 30, '水': 20, '火': 50, '土': 70 },
            '土': { '金': 30, '木': 70, '水': 80, '火': 20, '土': 50 }
        };

        return elementRelations[birthElement][dayElement] || 50;
    }

    // 计算农历和天干地支影响
    getTianGanDiZhiScore(date) {
        const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const birthDayOfYear = Math.floor((this.birthDate - new Date(this.birthDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

        const tianGanIndex = dayOfYear % 10;
        const diZhiIndex = dayOfYear % 12;
        const birthTianGanIndex = birthDayOfYear % 10;
        const birthDiZhiIndex = birthDayOfYear % 12;

        // 天干地支匹配度计算
        let score = 50;
        if (tianGanIndex === birthTianGanIndex) score += 20;
        if (diZhiIndex === birthDiZhiIndex) score += 20;
        if (Math.abs(tianGanIndex - birthTianGanIndex) <= 2) score += 10;
        if (Math.abs(diZhiIndex - birthDiZhiIndex) <= 2) score += 10;

        return Math.min(100, score);
    }

    // 计算数字命理影响
    getNumerologyScore(date) {
        const lifeNumber = this.calculateLifeNumber();
        const dateSum = date.getFullYear() + (date.getMonth() + 1) + date.getDate();
        const dateNumber = dateSum % 9 + 1;

        // 数字相性计算
        const compatibility = {
            1: [1, 5, 7], 2: [2, 4, 8], 3: [3, 6, 9],
            4: [2, 4, 8], 5: [1, 5, 7], 6: [3, 6, 9],
            7: [1, 5, 7], 8: [2, 4, 8], 9: [3, 6, 9]
        };

        if (compatibility[lifeNumber].includes(dateNumber)) {
            return 70 + Math.random() * 20; // 70-90
        } else {
            return 30 + Math.random() * 40; // 30-70
        }
    }

    // 计算月相和星座影响
    getAstrologyScore(date) {
        const moonPhase = this.getMoonPhase(date);
        const zodiacCompatibility = this.getZodiacCompatibility(date);

        return (moonPhase + zodiacCompatibility) / 2;
    }

    getMoonPhase(date) {
        // 简化的月相计算
        const dayOfMonth = date.getDate();
        if (dayOfMonth <= 7 || dayOfMonth >= 23) return 60 + Math.random() * 30; // 新月/残月
        if (dayOfMonth >= 8 && dayOfMonth <= 15) return 70 + Math.random() * 25; // 上弦月
        return 50 + Math.random() * 40; // 满月
    }

    getZodiacCompatibility(date) {
        const birthMonth = this.birthMonth;
        const targetMonth = date.getMonth() + 1;

        // 十二星座相性简化计算
        const monthDiff = Math.abs(birthMonth - targetMonth);
        if (monthDiff === 0) return 80 + Math.random() * 15; // 同星座
        if (monthDiff === 4 || monthDiff === 8) return 75 + Math.random() * 20; // 三分相
        if (monthDiff === 6) return 40 + Math.random() * 20; // 对冲
        return 55 + Math.random() * 25; // 其他
    }

    // 主要的运势计算方法
    calculateFortuneScore(date) {
        const elementScore = this.getElementScore(date);
        const tianGanDiZhiScore = this.getTianGanDiZhiScore(date);
        const numerologyScore = this.getNumerologyScore(date);
        const astrologyScore = this.getAstrologyScore(date);

        // 加权平均
        const finalScore = (
            elementScore * 0.3 +
            tianGanDiZhiScore * 0.25 +
            numerologyScore * 0.25 +
            astrologyScore * 0.2
        );

        // 添加一些随机波动使结果更自然
        const randomFactor = (Math.random() - 0.5) * 10;
        const totalScore = Math.min(100, Math.max(0, finalScore + randomFactor));

        return {
            total: Math.round(totalScore),
            career: Math.round(Math.min(100, Math.max(0, elementScore + (Math.random() - 0.5) * 15))),
            family: Math.round(Math.min(100, Math.max(0, tianGanDiZhiScore + (Math.random() - 0.5) * 15))),
            friendship: Math.round(Math.min(100, Math.max(0, numerologyScore + (Math.random() - 0.5) * 15)))
        };
    }

    // 更新生日信息
    updateBirthDate(year, month, day) {
        this.birthYear = year;
        this.birthMonth = month;
        this.birthDay = day;
        this.birthDate = new Date(year, month - 1, day);
    }
}

class Heatmap {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('tooltip');

        this.options = {
            width: options.width || 800,
            height: options.height || 300,
            rows: 7, // 7 days of week
            cols: options.cols || 53, // 53 weeks to accommodate partial weeks
            padding: options.padding || 2,
            colorMap: options.colorMap || this.getDefaultColorMap(),
            labelPadding: 60, // Space for labels
            ...options
        };

        this.weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        this.weekdayLabels = ['', '周二', '', '周四', '', '周六', '']; // Only show specific days
        this.currentYear = new Date().getFullYear();
        this.calendarData = []; // Will store the actual calendar data
        this.fortuneCalculator = new FortuneCalculator(1990, 6, 15); // Default birth date

        this.data = [];
        this.cellWidth = 0;
        this.cellHeight = 0;

        this.init();
        this.generateCalendarData(this.currentYear);
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

    generateCalendarData(year) {
        // Initialize empty calendar grid
        this.calendarData = [];
        for (let i = 0; i < this.options.rows; i++) {
            this.calendarData.push(new Array(this.options.cols).fill(null));
        }

        // Get January 1st of the year
        const jan1 = new Date(year, 0, 1);
        let dayOfWeek = jan1.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Convert to our format (0 = Monday, 6 = Sunday)
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        let currentDate = new Date(jan1);
        let weekIndex = 0;

        // Fill the calendar
        while (currentDate.getFullYear() === year) {
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();
            const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            // Store date info with calculated fortune score
            const fortuneData = this.fortuneCalculator.calculateFortuneScore(new Date(currentDate));
            this.calendarData[dayOfWeek][weekIndex] = {
                date: new Date(currentDate),
                dateString: dateString,
                value: fortuneData.total / 100, // Normalize to 0-1 for color mapping
                scores: fortuneData, // Keep all score data
                month: month,
                day: day
            };

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
            dayOfWeek++;

            // Move to next week
            if (dayOfWeek >= 7) {
                dayOfWeek = 0;
                weekIndex++;
                if (weekIndex >= this.options.cols) break;
            }
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

        // Draw month labels (X-axis) - show month at first occurrence
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

        let lastMonth = 0;
        for (let j = 0; j < this.options.cols; j++) {
            // Find first day in this week column
            for (let i = 0; i < this.options.rows; i++) {
                const cellData = this.calendarData[i][j];
                if (cellData && cellData.month !== lastMonth) {
                    const x = j * (this.cellWidth + this.options.padding) + this.options.padding + this.cellWidth / 2 + this.options.labelPadding;
                    this.ctx.fillText(months[cellData.month - 1], x, 10);
                    lastMonth = cellData.month;
                    break;
                }
            }
        }

        // Draw heatmap cells
        for (let i = 0; i < this.options.rows; i++) {
            for (let j = 0; j < this.options.cols; j++) {
                const cellData = this.calendarData[i][j];

                if (cellData) {
                    const color = this.valueToColor(cellData.value);
                    const x = j * (this.cellWidth + this.options.padding) + this.options.padding + this.options.labelPadding;
                    const y = i * (this.cellHeight + this.options.padding) + this.options.padding + this.options.labelPadding;

                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight);

                    this.ctx.strokeStyle = '#e0e0e0';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);
                } else {
                    // Empty cell - draw light gray background
                    const x = j * (this.cellWidth + this.options.padding) + this.options.padding + this.options.labelPadding;
                    const y = i * (this.cellHeight + this.options.padding) + this.options.padding + this.options.labelPadding;

                    this.ctx.fillStyle = '#f8f8f8';
                    this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight);

                    this.ctx.strokeStyle = '#e0e0e0';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);
                }
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
            const cellData = this.calendarData[row][col];
            if (cellData) {
                return {
                    row, col,
                    date: cellData.date,
                    dateString: cellData.dateString,
                    value: cellData.value,
                    scores: cellData.scores,
                    weekday: this.weekdays[row]
                };
            }
        }
        return null;
    }

    showTooltip(x, y, content, scores) {
        this.hideTooltip(); // Clear any existing tooltip

        this.tooltip.innerHTML = content;

        const tooltipWidth = 320;
        const tooltipHeight = 220;

        let tooltipX = x + 15;
        let tooltipY = y - tooltipHeight / 2;

        if (tooltipX + tooltipWidth > window.innerWidth) {
            tooltipX = x - tooltipWidth - 15;
        }
        if (tooltipY < 0) {
            tooltipY = 10;
        }
        if (tooltipY + tooltipHeight > window.innerHeight) {
            tooltipY = window.innerHeight - tooltipHeight - 10;
        }

        this.tooltip.style.left = tooltipX + 'px';
        this.tooltip.style.top = tooltipY + 'px';
        this.tooltip.classList.add('show');

        // Wait for DOM to update, then create charts
        setTimeout(() => {
            this.createCharts(scores);
        }, 50);
    }

    hideTooltip() {
        this.tooltip.classList.remove('show');
        // Destroy existing charts
        if (this.gaugeChart) {
            this.gaugeChart.destroy();
            this.gaugeChart = null;
        }
        if (this.barChart) {
            this.barChart.destroy();
            this.barChart = null;
        }
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const cell = this.getCellFromCoordinates(e.clientX, e.clientY);
            if (cell) {
                const dateStr = cell.date.toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });

                const content = this.createTooltipContent(dateStr, cell.scores);

                const rect = this.canvas.getBoundingClientRect();
                const cellCenterX = rect.left + this.options.labelPadding + cell.col * (this.cellWidth + this.options.padding) + this.options.padding + this.cellWidth / 2;
                const cellCenterY = rect.top + this.options.labelPadding + cell.row * (this.cellHeight + this.options.padding) + this.options.padding + this.cellHeight / 2;

                this.showTooltip(cellCenterX, cellCenterY, content, cell.scores);
            } else {
                this.hideTooltip();
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    // Update birth date for fortune calculation
    updateBirthDate(year, month, day) {
        this.fortuneCalculator.updateBirthDate(year, month, day);
        this.generateCalendarData(this.currentYear);
        this.render();
    }

    createTooltipContent(dateStr, scores) {
        const tooltipId = 'tooltip-' + Date.now();

        return `
            <div class="tooltip-content">
                <div class="tooltip-header">
                    <h4>${dateStr}</h4>
                </div>
                <div class="charts-container">
                    <div class="gauge-section">
                        <canvas id="gauge-${tooltipId}" width="150" height="75"></canvas>
                    </div>
                    <div class="bars-section">
                        <canvas id="bars-${tooltipId}" width="200" height="120"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    setYear(year) {
        this.currentYear = year;
        this.generateCalendarData(year);
        this.render();
    }

    createCharts(scores) {
        const tooltipId = Date.now();

        // Create gauge chart (doughnut chart as speedometer)
        const gaugeCanvas = this.tooltip.querySelector(`canvas[id*="gauge"]`);
        if (gaugeCanvas) {
            const ctx = gaugeCanvas.getContext('2d');
            this.gaugeChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [scores.total, 100 - scores.total],
                        backgroundColor: [
                            this.getGaugeColor(scores.total),
                            'rgba(255, 255, 255, 0.1)'
                        ],
                        borderWidth: 0,
                        circumference: 180,
                        rotation: 270
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                },
                plugins: [{
                    afterDraw: (chart) => {
                        const ctx = chart.ctx;
                        const centerX = chart.width / 2;
                        const centerY = chart.height / 2;

                        ctx.save();
                        ctx.font = 'bold 16px Arial';
                        ctx.fillStyle = 'white';
                        ctx.textAlign = 'center';
                        ctx.fillText(scores.total, centerX, centerY - 5);

                        ctx.font = '10px Arial';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.fillText('总运势', centerX, centerY + 10);
                        ctx.restore();
                    }
                }]
            });
        }

        // Create bar chart
        const barCanvas = this.tooltip.querySelector(`canvas[id*="bars"]`);
        if (barCanvas) {
            const ctx = barCanvas.getContext('2d');
            this.barChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['事业', '家庭', '友情'],
                    datasets: [{
                        data: [scores.career, scores.family, scores.friendship],
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.8)',
                            'rgba(231, 76, 60, 0.8)',
                            'rgba(243, 156, 18, 0.8)'
                        ],
                        borderColor: [
                            'rgba(52, 152, 219, 1)',
                            'rgba(231, 76, 60, 1)',
                            'rgba(243, 156, 18, 1)'
                        ],
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: { size: 10 }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                font: { size: 11 }
                            },
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                }
            });
        }
    }

    getGaugeColor(score) {
        if (score >= 80) return '#27ae60'; // Green
        if (score >= 60) return '#f39c12'; // Orange
        if (score >= 40) return '#e67e22'; // Dark orange
        return '#e74c3c'; // Red
    }

    regenerateData() {
        this.generateCalendarData(this.currentYear);
        this.render();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const heatmap = new Heatmap('heatmap-canvas', {
        width: 800,
        height: 300,
        cols: 53
    });

    // Heatmap year selector
    const heatmapYear = document.getElementById('heatmap-year');

    // Populate heatmap year options (recent years)
    function populateHeatmapYearOptions() {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 10; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + '年';
            if (year === currentYear) option.selected = true;
            heatmapYear.appendChild(option);
        }
    }

    // Event listener for heatmap year change
    heatmapYear.addEventListener('change', () => {
        const selectedYear = parseInt(heatmapYear.value);
        heatmap.setYear(selectedYear);
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
        updateHeatmapWithBirthDate();
    });

    birthMonth.addEventListener('change', () => {
        populateDayOptions();
        saveBirthDate();
        updateHeatmapWithBirthDate();
    });

    birthDay.addEventListener('change', () => {
        saveBirthDate();
        updateHeatmapWithBirthDate();
    });

    // Function to update heatmap when birth date changes
    function updateHeatmapWithBirthDate() {
        const year = parseInt(birthYear.value);
        const month = parseInt(birthMonth.value);
        const day = parseInt(birthDay.value);
        heatmap.updateBirthDate(year, month, day);
    }

    // Initialize birth date
    populateYearOptions();
    populateDayOptions();
    loadBirthDate();
    // Update heatmap with loaded birth date
    updateHeatmapWithBirthDate();

    // Initialize heatmap year selector
    populateHeatmapYearOptions();

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