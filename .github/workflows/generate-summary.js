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
        
        // Handle Playwright's JSON reporter format
        if (results.suites) {
            results.suites.forEach(suite => {
                const processSuite = (s) => {
                    if (s.specs && s.specs.length > 0) {
                        s.specs.forEach(spec => {
                            if (spec.tests && spec.tests.length > 0) {
                                spec.tests.forEach(test => {
                                    summary.total++;
                                    const result = test.results && test.results[0];
                                    
                                    if (result) {
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
                                    }
                                });
                            }
                        });
                    }
                    
                    // Recursively process nested suites
                    if (s.suites && s.suites.length > 0) {
                        s.suites.forEach(nestedSuite => processSuite(nestedSuite));
                    }
                };
                
                processSuite(suite);
            });
        }
        
        console.log(`Parsed results: ${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped, ${summary.total} total`);
    } else {
        console.log(`Results file not found at: ${resultsPath}`);
        console.log('Using default values (all zeros)');
    }
} catch (error) {
    console.error('Error reading test results:', error);
    console.log('Using default values (all zeros)');
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
    : 'N/A';

// Determine status emoji
const statusEmoji = summary.total === 0 ? '⏳' : (summary.failed === 0 ? '✅' : '❌');
const statusText = summary.total === 0 
    ? 'No test results available yet' 
    : (summary.failed === 0 ? 'All tests passed!' : `${summary.failed} test(s) failed`);

// Generate markdown summary
let markdown = `# ${statusEmoji} TEST RESULTS SUMMARY\n\n`;

// Quick status badges
markdown += `<div align="center">\n\n`;
if (summary.total > 0) {
    const status = summary.failed === 0 ? 'passing' : 'failing';
    const color = summary.failed === 0 ? 'brightgreen' : 'red';
    markdown += `![Tests](https://img.shields.io/badge/tests-${status}-${color})\n`;
    markdown += `![Passed](https://img.shields.io/badge/passed-${summary.passed}-brightgreen)\n`;
    if (summary.failed > 0) {
        markdown += `![Failed](https://img.shields.io/badge/failed-${summary.failed}-red)\n`;
    }
    if (summary.skipped > 0) {
        markdown += `![Skipped](https://img.shields.io/badge/skipped-${summary.skipped}-yellow)\n`;
    }
    markdown += `![Success Rate](https://img.shields.io/badge/success_rate-${successRate}%25-${summary.failed === 0 ? 'brightgreen' : (successRate >= 70 ? 'yellow' : 'red')})\n`;
}
markdown += `\n</div>\n\n`;

// Visual progress bar
if (summary.total > 0) {
    const passedPercent = Math.round((summary.passed / summary.total) * 100);
    const failedPercent = Math.round((summary.failed / summary.total) * 100);
    const skippedPercent = Math.round((summary.skipped / summary.total) * 100);
    
    const passedBlocks = Math.round(passedPercent / 5);
    const failedBlocks = Math.round(failedPercent / 5);
    const skippedBlocks = Math.round(skippedPercent / 5);
    
    markdown += `### Progress Bar\n`;
    markdown += '```\n';
    markdown += '🟢'.repeat(passedBlocks);
    markdown += '🔴'.repeat(failedBlocks);
    markdown += '⚪'.repeat(skippedBlocks);
    markdown += '\n```\n';
    markdown += `${passedPercent}% Passed | ${failedPercent}% Failed | ${skippedPercent}% Skipped\n\n`;
}

// Stats table
markdown += `### 📈 Test Statistics\n\n`;
markdown += `| Metric | Value | Percentage |\n`;
markdown += `|--------|-------|------------|\n`;
markdown += `| ✅ Passed | **${summary.passed}** | ${summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0}% |\n`;
markdown += `| ❌ Failed | **${summary.failed}** | ${summary.total > 0 ? Math.round((summary.failed / summary.total) * 100) : 0}% |\n`;
markdown += `| ⏭️ Skipped | **${summary.skipped}** | ${summary.total > 0 ? Math.round((summary.skipped / summary.total) * 100) : 0}% |\n`;
markdown += `| 📊 Total Tests | **${summary.total}** | 100% |\n`;
markdown += `| ⏱️ Duration | **${summary.total > 0 ? formatDuration(summary.duration) : 'N/A'}** | - |\n\n`;

// Status badge
if (summary.total === 0) {
    markdown += `## ⏳ ${statusText}\n\n`;
    markdown += `> ℹ️ Tests haven't run yet or results file is missing.\n\n`;
} else if (summary.failed === 0) {
    markdown += `## 🎉 ${statusText}\n\n`;
    markdown += `> ✨ Great job! All ${summary.total} test${summary.total > 1 ? 's' : ''} passed successfully!\n\n`;
} else {
    markdown += `## ⚠️ ${statusText}\n\n`;
    
    // Failed tests details with expandable section
    if (summary.tests.length > 0) {
        markdown += `<details>\n`;
        markdown += `<summary><b>❌ Failed Tests Details (Click to expand)</b></summary>\n\n`;
        markdown += `\n`;
        summary.tests.forEach((test, index) => {
            markdown += `#### ${index + 1}. ${test.title}\n`;
            markdown += `- **📁 File:** \`${test.file}\`\n`;
            markdown += `- **💥 Error:**\n`;
            markdown += `\`\`\`\n${test.error}\n\`\`\`\n\n`;
        });
        markdown += `</details>\n\n`;
    }
}

markdown += `---\n\n`;

// Report links with better formatting
const reportUrl = `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io/${process.env.GITHUB_REPOSITORY?.split('/')[1]}/reports/${process.env.GITHUB_RUN_NUMBER}`;

markdown += `## 📊 View Detailed Reports\n\n`;
markdown += `<table>\n`;
markdown += `<tr>\n`;
markdown += `<td align="center" width="50%">\n`;
markdown += `<h3>🌐 Interactive HTML Report</h3>\n`;
markdown += `<a href="${reportUrl}">Click here to view</a>\n`;
markdown += `<br><br>\n`;
markdown += `<i>Includes screenshots, videos, and traces</i>\n`;
markdown += `</td>\n`;
markdown += `<td align="center" width="50%">\n`;
markdown += `<h3>� Download Artifacts</h3>\n`;
markdown += `<a href="https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}">View in Actions</a>\n`;
markdown += `<br><br>\n`;
markdown += `<i>Access test results and screenshots</i>\n`;
markdown += `</td>\n`;
markdown += `</tr>\n`;
markdown += `</table>\n\n`;

markdown += `<details>\n`;
markdown += `<summary><b>ℹ️ What's included in the report?</b></summary>\n\n`;
markdown += `The interactive report provides:\n\n`;
markdown += `- ✅ **Test Results** - Detailed pass/fail status for each test\n`;
markdown += `- 📸 **Screenshots** - Automatic screenshots on test failures\n`;
markdown += `- 🎥 **Videos** - Full video recordings of failed tests\n`;
markdown += `- 🔍 **Traces** - Step-by-step execution traces for debugging\n`;
markdown += `- 📋 **Logs** - Console logs and network activity\n`;
markdown += `- 🔎 **Search & Filter** - Find specific tests quickly\n`;
markdown += `- 📱 **Responsive Design** - View on any device\n\n`;
markdown += `</details>\n\n`;

// Run information with better styling
markdown += `---\n\n`;
markdown += `## ℹ️ Run Information\n\n`;
markdown += `<table>\n`;
markdown += `<tr><td><b>🏃 Run Number</b></td><td><code>#${process.env.GITHUB_RUN_NUMBER}</code></td></tr>\n`;
markdown += `<tr><td><b>🌿 Branch</b></td><td><code>${process.env.GITHUB_REF_NAME}</code></td></tr>\n`;
markdown += `<tr><td><b>👤 Triggered By</b></td><td>${process.env.GITHUB_ACTOR || 'GitHub Actions'}</td></tr>\n`;
markdown += `<tr><td><b>⚙️ Workflow</b></td><td>${process.env.GITHUB_WORKFLOW || 'N/A'}</td></tr>\n`;
markdown += `<tr><td><b>🔗 Repository</b></td><td><a href="https://github.com/${process.env.GITHUB_REPOSITORY}">${process.env.GITHUB_REPOSITORY}</a></td></tr>\n`;
markdown += `<tr><td><b>📅 Timestamp</b></td><td>${new Date().toUTCString()}</td></tr>\n`;
markdown += `</table>\n\n`;

// Quick links
markdown += `### 🔗 Quick Links\n\n`;
markdown += `- [📋 View Workflow Run](https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID})\n`;
markdown += `- [� Browse Repository](https://github.com/${process.env.GITHUB_REPOSITORY})\n`;
markdown += `- [🌳 View Branch](https://github.com/${process.env.GITHUB_REPOSITORY}/tree/${process.env.GITHUB_REF_NAME})\n`;
if (process.env.GITHUB_SHA) {
    markdown += `- [📝 View Commit](https://github.com/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA})\n`;
}
markdown += `\n`;

// Footer with emoji decoration
markdown += `---\n\n`;
markdown += `<div align="center">\n`;
markdown += `<i>Generated automatically by GitHub Actions 🤖</i>\n`;
markdown += `<br>\n`;
markdown += `<sub>Powered by Playwright 🎭</sub>\n`;
markdown += `</div>\n`;

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
