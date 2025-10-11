// Hacking Text Reveal Effect
class HackingReveal {
    constructor() {
        this.hackingChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '@', '#', '$', '&', '*', '(', ')', '-', '_', '+', '=', '/', '[', ']', '{', '}', ';', ':', '<', '>', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.isAnimating = false;
    }

    getRandomChar() {
        return this.hackingChars[Math.floor(Math.random() * this.hackingChars.length)];
    }

    async showHackingOverlay(issueNumber) {
        // Skip the overlay - just return immediately for instant loading
        return Promise.resolve();
    }

    async animateHackingText(element, messages) {
        for (let msgIndex = 0; msgIndex < messages.length; msgIndex++) {
            const message = messages[msgIndex];
            const isLastMessage = msgIndex === messages.length - 1;
            
            // Clear current text
            element.innerHTML = '<span class="hacking-cursor"></span>';
            
            // Animate each character
            for (let i = 0; i <= message.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 50));
                
                let displayText = '';
                
                // Show correct characters up to current position
                for (let j = 0; j < i; j++) {
                    displayText += message[j];
                }
                
                // Add glitchy characters for remaining positions (first 3 chars only for performance)
                const glitchCount = Math.min(3, message.length - i);
                for (let k = 0; k < glitchCount; k++) {
                    displayText += this.getRandomChar();
                }
                
                element.innerHTML = displayText + '<span class="hacking-cursor"></span>';
            }
            
            // Wait before next message (except for last message)
            if (!isLastMessage) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    }

    animateContentOut(callback) {
        const articlesContainer = document.getElementById('articles-container');
        if (!articlesContainer) {
            if (callback) callback();
            return;
        }
        
        // Find all text elements and scramble them
        const textElements = articlesContainer.querySelectorAll('p, .headline, .citation, h2, h3');
        let completedAnimations = 0;
        let totalAnimations = 0;
        
        // Count elements that will actually be animated
        textElements.forEach((element) => {
            if (!element.querySelector('a') && !element.classList.contains('tech-talk-underline')) {
                totalAnimations++;
            }
        });
        
        if (totalAnimations === 0) {
            // Short delay to prevent immediate callback
            setTimeout(() => {
                if (callback) callback();
            }, 150);
            return;
        }
        
        textElements.forEach((element, index) => {
            // Skip elements with special formatting
            if (element.querySelector('a') || element.classList.contains('tech-talk-underline')) {
                return;
            }
            
            this.scrambleElementOut(element, () => {
                completedAnimations++;
                if (completedAnimations >= totalAnimations) {
                    // Small delay before callback to ensure all animations complete
                    setTimeout(() => {
                        if (callback) callback();
                    }, 50);
                }
            });
        });
    }

    scrambleElementOut(element, callback) {
        const originalText = element.textContent;
        if (!originalText || originalText.length < 2) {
            callback();
            return;
        }
        
        let iteration = 0;
        const maxIterations = 8; // Quick scramble out
        
        const animate = () => {
            if (iteration >= maxIterations) {
                callback();
                return;
            }
            
            let scrambledText = '';
            for (let i = 0; i < originalText.length; i++) {
                scrambledText += this.getRandomChar();
            }
            
            element.textContent = scrambledText;
            element.style.color = '#8B4B4B';
            
            iteration++;
            setTimeout(animate, 40); // Fast scramble
        };
        
        animate();
    }

    animateContentReveal(isNavigation = false, onComplete = null) {
        const articlesContainer = document.getElementById('articles-container');
        if (!articlesContainer) return;
        
        // Add hacking reveal class
        articlesContainer.classList.add('hacking-reveal');
        
        // Find all text elements and animate them, excluding elements with special formatting
        const textElements = articlesContainer.querySelectorAll('p, .headline, span.headline, .citation, h2, h3');
        
        let completedAnimations = 0;
        let totalAnimations = 0;
        
        // Count elements that will be animated
        textElements.forEach((element) => {
            if (!element.classList.contains('tech-talk-underline')) {
                totalAnimations++;
            }
        });
        
        if (totalAnimations === 0) {
            if (onComplete) onComplete();
            return;
        }
        
        textElements.forEach((element, index) => {
            // Skip elements with special formatting but allow elements with links
            if (element.classList.contains('tech-talk-underline')) {
                return;
            }
            
            setTimeout(() => {
                this.revealElement(element, isNavigation, () => {
                    completedAnimations++;
                    if (completedAnimations >= totalAnimations && onComplete) {
                        onComplete();
                    }
                });
            }, index * 80); // Slower stagger timing
        });
    }

    revealElement(element, isNavigation = false, onComplete = null) {
        let originalText, originalHTML;
        let hasLink = element.querySelector('a');
        
        if (isNavigation) {
            // For navigation, get the target text from data attributes
            originalText = element.getAttribute('data-target-text');
            originalHTML = element.getAttribute('data-target-html') || originalText;
            
            if (!originalText || originalText.length < 2) {
                if (onComplete) onComplete();
                return;
            }
            
            // For elements with links, preserve the link and only animate the text part
            if (hasLink) {
                const linkElement = element.querySelector('a');
                element.textContent = '';
                element.appendChild(linkElement); // Keep the link at the end
            } else {
                element.textContent = '';
            }
        } else {
            // For initial load, use existing text
            if (hasLink) {
                // Extract text without the link text
                const linkElement = element.querySelector('a');
                originalText = element.textContent.replace(linkElement.textContent, '').trim();
                originalHTML = element.innerHTML;
            } else {
                originalText = element.textContent;
                originalHTML = element.innerHTML;
            }
            
            if (!originalText || originalText.length < 2) {
                if (onComplete) onComplete();
                return;
            }
        }
        
        const maxIterations = 18; // More iterations for slower reveal
        let iteration = 0;
        
        element.style.color = '#8B4B4B'; // Start with dusty dark red
        
        const animate = () => {
            if (iteration >= maxIterations) {
                // Restore original HTML to preserve formatting
                element.innerHTML = originalHTML;
                element.style.color = ''; // Reset color
                if (onComplete) onComplete();
                return;
            }
            
            let revealedText = '';
            const revealLength = Math.floor((iteration / maxIterations) * originalText.length);
            
            // Show correct characters
            for (let i = 0; i < revealLength; i++) {
                revealedText += originalText[i];
            }
            
            // Add glitch characters at the end (more for dramatic effect)
            const glitchCount = Math.min(4, originalText.length - revealLength);
            for (let i = 0; i < glitchCount; i++) {
                revealedText += this.getRandomChar();
            }
            
            // Handle elements with links
            if (hasLink && isNavigation) {
                const linkElement = element.querySelector('a');
                element.textContent = revealedText;
                if (linkElement) {
                    element.appendChild(document.createTextNode(' '));
                    element.appendChild(linkElement);
                }
            } else if (hasLink && !isNavigation) {
                // For initial load, just update the text before the link
                const linkElement = element.querySelector('a');
                element.textContent = revealedText;
                if (linkElement) {
                    element.appendChild(document.createTextNode(' '));
                    element.appendChild(linkElement);
                }
            } else {
                element.textContent = revealedText;
            }
            
            // Add dusty dark red and dusty grey flash effect during animation
            if (iteration < maxIterations - 4) {
                element.style.color = '#8B4B4B'; // Dusty dark red
            } else if (iteration < maxIterations - 2) {
                element.style.color = '#6B6B6B'; // Dusty grey
            } else {
                element.style.color = ''; // Reset to original
            }
            
            iteration++;
            
            setTimeout(animate, 110); // Much slower animation speed for better appreciation
        };
        
        animate();
    }
}

// Newspaper Template System
class NewspaperTemplate {
    constructor() {
        this.currentIssue = null;
        this.issues = {};
        this.hackingReveal = new HackingReveal();
        this.init();
    }

    init() {
        // Get issue number from URL parameter or default to 29
        const urlParams = new URLSearchParams(window.location.search);
        const issueNumber = urlParams.get('issue') || '29';
        this.loadIssue(issueNumber);
    }

    async loadIssue(issueNumber) {
        try {
            const response = await fetch(`issues/issue-${issueNumber}.json`);
            if (!response.ok) {
                throw new Error(`Issue ${issueNumber} not found`);
            }
            const issueData = await response.json();
            
            // If this is a navigation (not initial load), clear content and animate reveal
            const articlesContainer = document.getElementById('articles-container');
            if (this.currentIssue && articlesContainer && articlesContainer.children.length > 0) {
                // Clear all content first
                articlesContainer.innerHTML = '';
                
                // Update current issue data
                this.currentIssue = issueData;
                
                // Create the full content but store it for the animation
                const tempContainer = document.createElement('div');
                if (issueData.columns && issueData.columns.length === 5) {
                    issueData.columns.forEach(column => {
                        const columnElement = this.createColumnElement(column);
                        tempContainer.appendChild(columnElement);
                    });
                } else {
                    this.createDefaultColumns(tempContainer);
                }
                
                // Get all text elements and their content
                const textElements = tempContainer.querySelectorAll('p, .headline, span.headline, .citation, h2, h3');
                const textContents = [];
                textElements.forEach((element, index) => {
                    if (!element.classList.contains('tech-talk-underline')) {
                        textContents[index] = {
                            text: element.textContent,
                            html: element.innerHTML
                        };
                    }
                });
                
                // Now create empty structure
                articlesContainer.innerHTML = tempContainer.innerHTML;
                
                // Clear text content but keep structure
                const newTextElements = articlesContainer.querySelectorAll('p, .headline, span.headline, .citation, h2, h3');
                newTextElements.forEach((element, index) => {
                    if (!element.classList.contains('tech-talk-underline')) {
                        // For elements with links, preserve the link but clear the text
                        if (element.querySelector('a')) {
                            const linkElement = element.querySelector('a');
                            const textBeforeLink = textContents[index] ? textContents[index].text.replace(linkElement.textContent, '').trim() : '';
                            element.textContent = '';
                            element.appendChild(linkElement); // Keep the link
                            element.setAttribute('data-target-text', textBeforeLink);
                            element.setAttribute('data-target-html', textContents[index] ? textContents[index].html : '');
                        } else {
                            element.textContent = '';
                        }
                        
                        // Store the target content as data attributes
                        if (textContents[index] && !element.querySelector('a')) {
                            element.setAttribute('data-target-text', textContents[index].text);
                            element.setAttribute('data-target-html', textContents[index].html);
                        }
                    }
                });
                
                // Update page title and header during navigation
                const pageTitle = `AURAK's Tech Talk - Issue #${issueData.issueNumber}`;
                document.getElementById('page-title').textContent = pageTitle;
                
                // Update issue info
                document.getElementById('issue-info').innerHTML = 
                    `Issue #${issueData.issueNumber} brought to you by the <strong>${issueData.publishedBy}</strong> on <em>${issueData.publishDate}</em>`;

                // Update navigation (but not bug position yet)
                this.updateNavigation(issueData.issueNumber);
                
                // Start reveal animation to build up text from nothing
                setTimeout(() => {
                    this.hackingReveal.animateContentReveal(true, () => {
                        // Only show bug after all animations are complete
                        this.updateBugPosition(issueData.bugPosition);
                    }); // Pass true for navigation
                }, 50);
            } else {
                // Initial load - just render and animate
                this.currentIssue = issueData;
                this.renderIssue(issueData);
                
                // Start matrix-style text reveal animation immediately after rendering
                setTimeout(() => {
                    this.hackingReveal.animateContentReveal(false, () => {
                        // Only show bug after all animations are complete
                        this.updateBugPosition(issueData.bugPosition);
                    }); // Pass false for initial load
                }, 50);
            }
            
        } catch (error) {
            console.error('Error loading issue:', error);
            // Fallback to default content if issue not found
            this.loadDefaultContent();
        }
    }

    renderIssue(issueData) {
        // Update page title and header
        const pageTitle = `AURAK's Tech Talk - Issue #${issueData.issueNumber}`;
        document.getElementById('page-title').textContent = pageTitle;
        
        // Update issue info
        document.getElementById('issue-info').innerHTML = 
            `Issue #${issueData.issueNumber} brought to you by the <strong>${issueData.publishedBy}</strong> on <em>${issueData.publishDate}</em>`;

        // Clear and populate articles container
        const articlesContainer = document.getElementById('articles-container');
        articlesContainer.innerHTML = '';

        // Render each column (should always be 5 columns)
        if (issueData.columns && issueData.columns.length === 5) {
            issueData.columns.forEach(column => {
                const columnElement = this.createColumnElement(column);
                articlesContainer.appendChild(columnElement);
            });
        } else {
            // Fallback: create default 5-column structure with lorem ipsum
            this.createDefaultColumns(articlesContainer);
        }

        // Update navigation
        this.updateNavigation(issueData.issueNumber);
        
        // Bug position will be updated after animations complete
    }



    createColumnElement(column) {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'collumn';

        let columnHTML = '';

        // Process each article in the column
        column.articles.forEach((article, index) => {
            // Add headline
            if (article.headline) {
                columnHTML += `<div class="head"><span class="headline ${article.headlineClass || 'hl3'}">${article.headline}</span>`;
                
                // Add subheadline if exists
                if (article.subheadline) {
                    columnHTML += `<p><span class="headline ${article.subheadlineClass || 'hl4'}">${article.subheadline}</span></p>`;
                }
                
                // Add read more link if exists
                if (article.readMoreLink) {
                    columnHTML += `<span class="headline ${article.subheadline ? 'hl6' : 'hl4'}"><a href="${article.readMoreLink}" target="_blank" style="color: black;">Click here to read more</a></span>`;
                }
                
                columnHTML += `</div>`;
            }

            // Add content paragraphs
            if (article.content) {
                article.content.forEach(paragraph => {
                    if (paragraph.type === 'paragraph') {
                        // Handle faculty publication links
                        if (paragraph.facultyLink) {
                            columnHTML += `<p>${paragraph.text} <a href="${paragraph.facultyLink}" target="_blank" style="color: #2f2f2f; text-decoration: underline; font-weight: bold;">[Read Paper Here]</a></p>`;
                        } else {
                            columnHTML += `<p>${paragraph.text}</p>`;
                        }
                    } else if (paragraph.type === 'emphasis') {
                        // Special handling for email submission text to make it bold and italic
                        if (paragraph.text.includes('Want to get featured on the next Tech Talk?')) {
                            columnHTML += `<p><strong><em>${paragraph.text}</em></strong></p>`;
                            // Add formatting for email link
                            columnHTML = columnHTML.replace('codingclub2024@aurak.ac.ae', 
                                '<a href="mailto:codingclub2024@aurak.ac.ae" style="color: #2f2f2f; text-decoration: none; background-color: rgba(128, 128, 128, 0.5); padding: 2px 4px; border-radius: 3px;">codingclub2024@aurak.ac.ae</a>');
                        } else {
                            columnHTML += `<p><em>${paragraph.text}</em></p>`;
                        }
                    } else if (paragraph.type === 'citation') {
                        columnHTML += `<span class="citation">${paragraph.text}</span>`;
                    } else if (paragraph.type === 'figure') {
                        columnHTML += `
                            <figure class="figure">
                                <img class="media" src="${paragraph.src}" alt="${paragraph.alt || ''}">
                                <figcaption class="figcaption">${paragraph.caption}</figcaption>
                            </figure>
                        `;
                    } else if (paragraph.type === 'subheadline') {
                        columnHTML += `<div class="head"><span class="headline ${paragraph.class || 'hl5'}">${paragraph.text}</span>`;
                        if (paragraph.subtitle) {
                            columnHTML += `<p><span class="headline hl6">${paragraph.subtitle}</span></p>`;
                        }
                        columnHTML += `</div>`;
                    }
                });
            }
        });

        columnDiv.innerHTML = columnHTML;
        return columnDiv;
    }



    createDefaultColumns(container) {
        // Create 5 default columns with lorem ipsum content when issue data is malformed
        const defaultColumns = [
            // Column 1 - Main News + Quote
            {
                articles: [{
                    headline: "Tech News Update",
                    headlineClass: "hl3",
                    content: [
                        { type: "emphasis", text: "Welcome to our tech newsletter! This issue contains the latest updates from the world of technology." },
                        { type: "paragraph", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
                        { type: "citation", text: "\"Technology is nothing. What's important is that you have a faith in people.\" - Steve Jobs" },
                        { type: "paragraph", text: "This quote reminds us that behind every technological advancement are the people who make it possible." }
                    ]
                }]
            },
            // Column 2 - Second News
            {
                articles: [{
                    headline: "Development Update",
                    headlineClass: "hl5",
                    content: [
                        { type: "paragraph", text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
                        { type: "paragraph", text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." }
                    ]
                }]
            },
            // Column 3 - Third News
            {
                articles: [{
                    headline: "Innovation Spotlight",
                    headlineClass: "hl1",
                    content: [
                        { type: "paragraph", text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
                        { type: "paragraph", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium." }
                    ]
                }]
            },
            // Column 4 - Faculty Publications + Tech Trivia
            {
                articles: [
                    {
                        headline: "Stand on the shoulders of giants",
                        headlineClass: "hl3",
                        subheadline: "Recent Faculty Publications",
                        subheadlineClass: "hl4",
                        content: [
                            { 
                                type: "paragraph", 
                                text: "Dr. Sample Faculty has published research on emerging technologies in the Journal of Computer Science.",
                                facultyLink: "https://example.com/faculty-publication-1"
                            },
                            { 
                                type: "paragraph", 
                                text: "Professor Example has collaborated on breakthrough research published in Nature Technology.",
                                facultyLink: "https://example.com/faculty-publication-2"
                            }
                        ]
                    },
                    {
                        headline: "Tech Trivia",
                        headlineClass: "hl5",
                        subheadline: "Did You Know?",
                        subheadlineClass: "hl6",
                        content: [
                            { type: "paragraph", text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores." }
                        ]
                    }
                ]
            },
            // Column 5 - Peer2Peer
            {
                articles: [{
                    headline: "Peer2Peer",
                    headlineClass: "hl1",
                    subheadline: "by STUDENT NAME",
                    subheadlineClass: "hl4",
                    content: [
                        { type: "paragraph", text: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit." },
                        { type: "emphasis", text: "Want to get featured on the next Tech Talk? Write about any topic that inspires you — tech-related or beyond and email your submission to codingclub2024@aurak.ac.ae." }
                    ]
                }]
            }
        ];

        defaultColumns.forEach(column => {
            const columnElement = this.createColumnElement(column);
            container.appendChild(columnElement);
        });
    }



    updateNavigation(currentIssueNumber) {
        const prevArrow = document.getElementById('prev-arrow');
        const nextArrow = document.getElementById('next-arrow');
        
        if (!prevArrow || !nextArrow) {
            console.error('Navigation arrows not found');
            return;
        }
        
        const prevIssue = parseInt(currentIssueNumber) - 1;
        const nextIssue = parseInt(currentIssueNumber) + 1;
        
        // Remove existing event listeners and add new ones
        prevArrow.onclick = (e) => {
            e.preventDefault();
            console.log('Previous arrow clicked, navigating to issue:', prevIssue);
            this.hideBug(); // Hide bug immediately when navigation starts
            this.navigateToIssue(prevIssue);
        };
        
        nextArrow.onclick = (e) => {
            e.preventDefault();
            console.log('Next arrow clicked, navigating to issue:', nextIssue);
            this.hideBug(); // Hide bug immediately when navigation starts
            this.navigateToIssue(nextIssue);
        };
        
        // You can add logic here to disable arrows if issues don't exist
    }

    updateBugPosition(bugPosition) {
        const bug = document.querySelector('.hidden-bug');
        if (bug && bugPosition) {
            // Update bug position based on JSON data
            bug.style.top = bugPosition.top || '45%';
            bug.style.left = bugPosition.left || '73%';
            bug.style.display = 'block'; // Make sure bug is visible
        } else if (bug) {
            // Fallback to default position if no bugPosition in JSON
            bug.style.top = '45%';
            bug.style.left = '73%';
            bug.style.display = 'block'; // Make sure bug is visible
        }
    }

    hideBug() {
        const bug = document.querySelector('.hidden-bug');
        if (bug) {
            bug.style.display = 'none';
        }
    }

    async navigateToIssue(issueNumber) {
        console.log('navigateToIssue called with:', issueNumber);
        console.log('Current issue:', this.currentIssue);
        
        if (typeof issueNumber === 'string') {
            // Handle 'prev' and 'next' strings
            const current = parseInt(this.currentIssue.issueNumber);
            issueNumber = issueNumber === 'prev' ? current - 1 : current + 1;
        }
        
        console.log('Final issue number to load:', issueNumber);
        
        // Check if the issue actually exists by trying to fetch it
        try {
            const response = await fetch(`issues/issue-${issueNumber}.json`);
            if (!response.ok) {
                console.warn(`Issue ${issueNumber} not available`);
                alert(`No more issues available in that direction.`);
                return;
            }
        } catch (error) {
            console.warn(`Issue ${issueNumber} not found:`, error);
            alert(`No more issues available in that direction.`);
            return;
        }
        
        // Update URL and load new issue
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('issue', issueNumber);
        window.history.pushState({}, '', newUrl);
        
        this.loadIssue(issueNumber.toString());
    }



    loadDefaultContent() {
        // Fallback content if JSON files aren't available - maintains 5-column structure
        const defaultIssue = {
            issueNumber: "29",
            publishedBy: "Coding Club",
            publishDate: "6th October, 2025",
            bugPosition: {
                "top": "45%",
                "left": "73%"
            },
            columns: [] // Empty columns will trigger createDefaultColumns method
        };
        
        this.currentIssue = defaultIssue;
        this.renderIssue(defaultIssue);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.newspaper = new NewspaperTemplate();
});
