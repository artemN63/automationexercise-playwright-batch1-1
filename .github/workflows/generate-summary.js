const fs = require('fs');
const path = require('path');

// Read test results JSON
let summary = {
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
    total: 0,
    duration: 0,
    tests: []
};

try {
    const resultsPath = path.join(__dirname, '../../test-results/results.json');
    
    if (fs.existsSync(resultsPath)) {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        
        results.suites.forEach(suite => {
            suite.specs.forEach(spec => {
                spec.tests.forEach(test => {
                    summary.total++;
                    const result = test.results[0];
                    
                    if (result.status === 'passed') summary.passed++;
                    else if (result.status === 'failed') summary.failed++;
                    else if (result.status === 'skipped') summary.skipped++;
                    
                    summary.duration += result.duration || 0;
                    
                    // Collect failed tests for details
                    if (result.status === 'failed') {
                        summary.tests.push({
                            title: spec.title,
                            file: spec.file,
                            error: result.error?.message || 'Unknown error'
                        });
                    }
                });
            });
        });
    }
} catch (error) {
    console.error('Error reading test results:', error);
}

// Format duration
const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
};

// Calculate success rate
const successRate = summary.total > 0 
    ? ((summary.passed / summary.total) * 100).toFixed(1) 
    : 0;

// Determine status emoji
const statusEmoji = summary.failed === 0 ? '✅' : '❌';
const statusText = summary.failed === 0 ? 'All tests passed!' : `${summary.failed} test(s) failed`;

// Generate markdown summary
let markdown = `# ${statusEmoji} Test Results Summary\n\n`;

// Stats table
markdown += `| Metric | Value |\n`;
markdown += `|--------|-------|\n`;
markdown += `| ✅ Passed | **${summary.passed}** |\n`;
markdown += `| ❌ Failed | **${summary.failed}** |\n`;
markdown += `| ⏭️ Skipped | **${summary.skipped}** |\n`;
markdown += `| 📊 Total | **${summary.total}** |\n`;
markdown += `| 🎯 Success Rate | **${successRate}%** |\n`;
markdown += `| ⏱️ Duration | **${formatDuration(summary.duration)}** |\n\n`;

// Status badge
if (summary.failed === 0) {
    markdown += `## 🎉 ${statusText}\n\n`;
} else {
    markdown += `## ⚠️ ${statusText}\n\n`;
    
    // Failed tests details
    if (summary.tests.length > 0) {
        markdown += `### Failed Tests:\n\n`;
        summary.tests.forEach((test, index) => {
            markdown += `${index + 1}. **${test.title}**\n`;
            markdown += `   - 📁 File: \`${test.file}\`\n`;
            markdown += `   - 💥 Error: \`${test.error.substring(0, 100)}${test.error.length > 100 ? '...' : ''}\`\n\n`;
        });
    }
}

markdown += `---\n\n`;

// Report links
const reportUrl = `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io/${process.env.GITHUB_REPOSITORY?.split('/')[1]}/reports/${process.env.GITHUB_RUN_NUMBER}`;

markdown += `## 📊 Detailed Reports\n\n`;
markdown += `🔗 **[View Full Interactive Report →](${reportUrl})**\n\n`;
markdown += `> 💡 The full report includes:\n`;
markdown += `> - 📸 Screenshots of failures\n`;
markdown += `> - 🎥 Video recordings\n`;
markdown += `> - 🔍 Execution traces for debugging\n`;
markdown += `> - 📋 Detailed test logs\n\n`;

// Run information
markdown += `---\n\n`;
markdown += `### ℹ️ Run Information\n\n`;
markdown += `| Property | Value |\n`;
markdown += `|----------|-------|\n`;
markdown += `| 🏃 Run Number | #${process.env.GITHUB_RUN_NUMBER} |\n`;
markdown += `| 🌿 Branch | \`${process.env.GITHUB_REF_NAME}\` |\n`;
markdown += `| 🔗 Repository | [${process.env.GITHUB_REPOSITORY}](https://github.com/${process.env.GITHUB_REPOSITORY}) |\n`;
markdown += `| 📅 Date | ${new Date().toUTCString()} |\n`;

// Write to GITHUB_STEP_SUMMARY
const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
    fs.appendFileSync(summaryFile, markdown);
    console.log('✅ Test summary generated successfully!');
} else {
    console.log(markdown);
}

// Exit with appropriate code
process.exit(summary.failed > 0 ? 1 : 0);
