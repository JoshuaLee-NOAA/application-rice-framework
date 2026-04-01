# RICE Framework Visualization

Interactive Priority Quadrant Chart for presentations.

## 📊 What's Included

### `priority-quadrant.html` - Interactive JavaScript Chart
- **Self-contained HTML file** - No installation required!
- Interactive chart with hover tooltips
- Color-coded by priority (Green/Amber/Red)
- Bubble sizes represent user base
- Quadrant backgrounds show strategic zones
- Works in any modern browser

## 🚀 Quick Start

**Just open the file!**

```bash
# On Mac
open visualization/priority-quadrant.html

# On Windows
start visualization/priority-quadrant.html

# Or just double-click the file in Finder/Explorer
```

The chart will open in your default web browser.

## 📸 Saving for Your Presentation

**Method 1: Save Image (Recommended)**
1. Chart displays in your browser
2. Right-click on the chart area
3. Select "Save Image As..."
4. Save as PNG

**Method 2: Screenshot**
1. Make browser full screen for best quality
2. Take screenshot (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)
3. Crop to chart area

**Optimized Size:** 1400×700px (fits most presentation templates)

## ✨ Features

- ✅ **Interactive tooltips** - Hover over bubbles to see details
- ✅ **Zero setup** - No installation, dependencies, or configuration
- ✅ **Responsive design** - Scales to window size
- ✅ **Works offline** - Uses CDN but caches for offline use
- ✅ **Professional styling** - Ready for executive presentations

---

## 📈 Chart Explanation

### Axes
- **X-axis (Horizontal):** Effort Score (1-5)
  - Left = Low effort/cost
  - Right = High effort/cost
  
- **Y-axis (Vertical):** Value Score (Reach × Impact × Confidence)
  - Bottom = Low value to mission
  - Top = High value to mission

### Bubble Properties
- **Color:** Priority tier
  - 🟢 Green = High Priority (RICE ≥ 20)
  - 🟡 Amber = Medium Priority (RICE 10-20)
  - 🔴 Red = Low Priority (RICE < 10)

- **Size:** Number of users
  - Larger = More users
  - Smaller = Fewer users

### Quadrants (Strategic Zones)

**✨ Sweet Spot** (Top-Left)
- High value, low effort
- **Strategy:** Maximize these wins, invest here

**💪 Mission Critical** (Top-Right)
- High value, high effort
- **Strategy:** Optimize for efficiency, justify costs

**📌 Maintain As-Is** (Bottom-Left)
- Low value, low effort
- **Strategy:** Keep stable, minimal investment

**⚠️ Rationalize** (Bottom-Right)
- Low value, high effort
- **Strategy:** Modernize or sunset

---

## 🎯 Use Cases

**For Executive Presentations:**
- Shows portfolio health at a glance
- Identifies resource allocation priorities
- Highlights modernization candidates

**For Budget Planning:**
- Justifies investment in high-value apps
- Identifies cost-saving opportunities
- Supports rationalization decisions

**For Strategic Planning:**
- Visualizes trade-offs (value vs cost)
- Guides modernization roadmap
- Tracks progress over time

---

## 🔄 Updating the Chart

The HTML file contains the data inline. To update with new analysis results:

1. Run the RICE analysis: `npm start`
2. Open `visualization/priority-quadrant.html` in a text editor
3. Find the `applications` array (around line 131)
4. Update the data from `output/rice-analysis.csv`
5. Save and refresh in browser

**Example data structure:**
```javascript
{ 
  name: 'Short Name',
  fullName: 'Full Application Name', 
  reach: 5, 
  impact: 5, 
  confidence: 4, 
  effort: 3, 
  rice: 33.33, 
  users: 15000 
}
```

---

## 💡 Tips for Presentations

### Best Practices
1. **Full screen first** - Maximize window before screenshot for best quality
2. **Use quadrant legend** - Explain the four strategic zones
3. **Highlight specific apps** - Tell stories about key applications
4. **Track over time** - Show progress if doing annual reviews

### PowerPoint/Google Slides
- Screenshot works best for static slides
- Chart is 1400×700px (fits standard 16:9 slides)
- Use "Crop to Shape" to remove any borders
- Add slide title and notes separately

### Interactive Presentations
- Open HTML file during live demo
- Hover over bubbles to show details in real-time
- Great for Q&A sessions and discussions
- Can zoom browser for better visibility

---

## 📝 Customization

### Changing Colors
Edit the `getColor()` function around line 167:
```javascript
function getColor(rice) {
    if (rice >= 20) return '#2ecc71';  // Green - High Priority
    if (rice >= 10) return '#f39c12';  // Amber - Medium Priority
    return '#e74c3c';  // Red - Low Priority
}
```

### Adjusting Priority Thresholds
Change the values (20, 10) to your preferred thresholds:
```javascript
if (rice >= 25) return '#2ecc71';  // Now need 25+ for high priority
if (rice >= 15) return '#f39c12';  // 15+ for medium
```

### Bubble Sizes
Adjust `minSize` and `maxSize` around line 175:
```javascript
const minSize = 8;   // Minimum bubble radius
const maxSize = 30;  // Maximum bubble radius
```

### Quadrant Dividing Lines
Change the midpoints around line 208:
```javascript
const midX = xAxis.getPixelForValue(2.5);  // Vertical line position
const midY = yAxis.getPixelForValue(62.5); // Horizontal line position
```

---

## 🐛 Troubleshooting

**Chart doesn't display:**
- ✓ Check internet connection (needs Chart.js from CDN on first load)
- ✓ Try different browser (Chrome, Firefox, Safari, Edge)
- ✓ Check JavaScript console for errors (F12 → Console tab)

**Data looks wrong:**
- ✓ Verify `output/rice-analysis.csv` is up to date
- ✓ Run `npm start` to regenerate analysis
- ✓ Check application names match exactly in HTML

**Screenshot is blurry:**
- ✓ Use full screen before taking screenshot
- ✓ Try "Save Image As" instead of screenshot
- ✓ Increase browser zoom to 150% then take screenshot and resize

**Bubbles overlap:**
- ✓ Adjust chart size by changing `height` in CSS (line 35)
- ✓ Adjust bubble sizes (see Customization section)
- ✓ Manually adjust label positions in code

---

## 📚 Additional Resources

- **Chart.js Documentation:** https://www.chartjs.org/
- **RICE Framework Guide:** See `docs/data-dictionary.md`
- **Analysis Tool:** Run `npm start` in project root
- **Project Repository:** Check README.md for full documentation

---

## 🚀 Quick Reference

| Task | Command |
|------|---------|
| Open chart | `open visualization/priority-quadrant.html` |
| Run analysis | `npm start` (from project root) |
| View results | `cat output/rice-analysis.csv` |
| Edit chart | Open `priority-quadrant.html` in text editor |

**Need help?** Open an issue in the repository or contact the Application Delivery Branch.
