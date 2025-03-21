// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initializeLoadingScreen();
    createMatrixRain();
    initializeTypewriter();
    initializeNavigation();
    fetchGitHubProjects();
    initializeThemeToggle();
    initializeMusicPlayers();
    loadAIImages();
    initializeModalClosers();
    initializeBackToTop();
    initializeProjectFilters();
    
    // Initialize any animations
    initializeLinkAnimations();
    initializeAvatarMatrix();
});

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Hide loading screen after content is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    });
}

// Matrix Rain Effect
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full screen
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    document.getElementById('matrix-background').appendChild(canvas);

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Matrix characters - expanded set
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,./<>?~`abcdefghijklmnopqrstuvwxyz';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];

    // Initialize drops with random positions
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100); // Random start position above screen
    }

    // Add some color variety
    const matrixColors = [
        '#0f0',     // Classic green
        '#0ff',     // Cyan
        '#0f8'      // Mint
    ];

    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw characters
        ctx.font = `${fontSize}px Fira Code, monospace`;

        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = chars[Math.floor(Math.random() * chars.length)];
            
            // Random color from our palette (bias toward green)
            const colorIndex = Math.random() < 0.8 ? 0 : Math.floor(Math.random() * matrixColors.length);
            ctx.fillStyle = matrixColors[colorIndex];
            
            // Calculate position
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            // Draw the character
            ctx.fillText(char, x, y);

            // Random brightness effect for some characters
            if (Math.random() > 0.99) {
                ctx.fillStyle = '#fff'; // Brighter white for emphasis
                ctx.fillText(char, x, y);
            }

            // Reset drop to top when it reaches bottom or randomly
            if (y > canvas.height && Math.random() > 0.99) {
                drops[i] = 0;
            }
            // Add randomness to the speed as well
            drops[i] += Math.random() * 0.5 + 0.5;
        }

        // Schedule next frame
        requestAnimationFrame(draw);
    }

    // Start animation
    requestAnimationFrame(draw);
}

// Typewriter effect for the intro section
function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;
    
    const messages = [
        "Software Engineer & AI Enthusiast",
        "Building at the intersection of AI and creativity",
        "Exploring the future of technology",
        "Learning, building, and sharing"
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentMessage = messages[messageIndex];
        
        if (isDeleting) {
            // Deleting text
            typewriterElement.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Typing text
            typewriterElement.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal speed when typing
        }
        
        // If finished typing the message
        if (!isDeleting && charIndex === currentMessage.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at the end
        } 
        // If finished deleting the message
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % messages.length;
            typingSpeed = 500; // Pause before typing next message
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start the typing effect
    setTimeout(type, 1000);
}

// Navigation functionality
function initializeNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Fetch and display GitHub projects
async function fetchGitHubProjects() {
    try {
        const username = "arun3676";
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub projects');
        }
        
        const repos = await response.json();
        
        const container = document.getElementById("projects-container");
        if (!container) return;
        
        // Remove loading indicator
        const loadingElement = container.querySelector('.project-loading');
        if (loadingElement) {
            container.removeChild(loadingElement);
        }
        
        // Filter and sort repos
        const significantRepos = repos
            .filter(repo => !repo.fork && repo.description) // Only show repos with descriptions
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sort by most recently updated
            .slice(0, 6); // Show top 6 repos
        
        // Define project categories (in a real scenario, this would come from repo topics or other metadata)
        const projectCategories = {
            "learning-path-generator": ["ai", "web"],
            "data-analysis-toolkit": ["data", "ai"],
            "ev-charging-dashboard": ["web", "data"],
            "matrix-portfolio": ["web"],
            "llm-titanic-analysis": ["ai", "data"],
            "ai-music-generator": ["ai"]
        };
        
        // Assign default categories based on repo name or use existing ones
        significantRepos.forEach(repo => {
            const lowerCaseName = repo.name.toLowerCase();
            let categories = [];
            
            // Look for keywords in repo name and description to assign categories
            if (lowerCaseName.includes('ai') || lowerCaseName.includes('ml') || 
                lowerCaseName.includes('model') || lowerCaseName.includes('neural') ||
                lowerCaseName.includes('learn')) {
                categories.push('ai');
            }
            
            if (lowerCaseName.includes('web') || lowerCaseName.includes('app') || 
                lowerCaseName.includes('ui') || lowerCaseName.includes('frontend') ||
                lowerCaseName.includes('react') || lowerCaseName.includes('vue') ||
                lowerCaseName.includes('angular')) {
                categories.push('web');
            }
            
            if (lowerCaseName.includes('data') || lowerCaseName.includes('analytics') || 
                lowerCaseName.includes('dashboard') || lowerCaseName.includes('visualization') ||
                lowerCaseName.includes('analysis')) {
                categories.push('data');
            }
            
            // If no categories were assigned, use "web" as default
            if (categories.length === 0) {
                categories = ['web'];
            }
            
            // Create project element
            const projectDiv = document.createElement("div");
            projectDiv.classList.add("project");
            projectDiv.dataset.categories = categories.join(' ');
            
            // Generate tags HTML
            const tagsHTML = categories.map(tag => 
                `<span class="project-tag">${tag}</span>`
            ).join('');
            
            projectDiv.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || ""}</p>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        Source
                    </a>
                    <a href="#" class="view-details" data-repo="${repo.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Details
                    </a>
                </div>
            `;
            
            container.appendChild(projectDiv);
            
            // Add event listener for the "View Details" button
            const detailsButton = projectDiv.querySelector('.view-details');
            detailsButton.addEventListener('click', (e) => {
                e.preventDefault();
                openProjectModal(repo);
            });
        });
        
        // Initialize filter buttons after projects are loaded
        initializeFilterButtons();
        
    } catch (error) {
        console.error("Error fetching GitHub projects:", error);
        const container = document.getElementById("projects-container");
        if (container) {
            container.innerHTML = '<div class="error-message"><p>Could not load projects at this time. Please try again later.</p></div>';
        }
    }
}

// Open project modal with details
function openProjectModal(repo) {
    const modal = document.getElementById('project-modal');
    const projectDetails = modal.querySelector('.project-details');
    
    // Sample tech stack and features (in a real app, this would come from repo data)
    const techStack = ['React', 'Node.js', 'MongoDB', 'Express'];
    const features = [
        'User authentication and authorization',
        'Real-time data visualization',
        'API integration with third-party services',
        'Responsive design for all devices'
    ];
    
    projectDetails.innerHTML = `
        <h2>${repo.name}</h2>
        <p class="project-description">${repo.description}</p>
        
        <div class="project-section">
            <h3>Tech Stack</h3>
            <div class="tech-stack">
                ${techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
        </div>
        
        <div class="project-section">
            <h3>Key Features</h3>
            <ul class="feature-list">
                ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="project-actions">
            <a href="${repo.html_url}" target="_blank" class="btn primary-btn">View Source</a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn secondary-btn">Live Demo</a>` : ''}
        </div>
    `;
    
    // Show the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Initialize project filter buttons
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the filter value
            const filter = button.dataset.filter;
            
            // Filter the projects
            filterProjects(filter);
        });
    });
}

// Filter projects based on category
function filterProjects(filter) {
    const projects = document.querySelectorAll('.project');
    
    projects.forEach(project => {
        const categories = project.dataset.categories ? project.dataset.categories.split(' ') : [];
        
        if (filter === 'all' || categories.includes(filter)) {
            project.style.display = 'flex';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, 10);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// Initialize filter buttons after projects are loaded
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Set "All" as active by default
    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filter = button.getAttribute('data-filter');
            
            // Apply filter
            const projects = document.querySelectorAll('.project');
            
            projects.forEach(project => {
                if (filter === 'all' || project.dataset.categories.includes(filter)) {
                    project.style.display = 'flex';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Toggle theme class
            body.classList.toggle('light-theme');
            
            // Save preference
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            
            // Show toast notification
            showToast(`Switched to ${currentTheme} mode`);
        });
    }
}



// Complete rewrite of music player functionality
function initializeMusicPlayers() {
    const playButtons = document.querySelectorAll('.play-button');
    let activeAudio = null;
    
    playButtons.forEach(button => {
        // Create a dedicated audio element for each button
        const trackSrc = button.getAttribute('data-track');
        const audio = new Audio(trackSrc);
        
        // Store the audio element directly on the button
        button.audioElement = audio;
        
        // Set up progress and time elements
        const playerControls = button.closest('.player-controls');
        const progressBar = playerControls.querySelector('.progress');
        const currentTimeDisplay = playerControls.querySelector('.current-time');
        const totalTimeDisplay = playerControls.querySelector('.total-time');
        
        // Set up visualizer
        const visualizerCanvas = button.closest('.music-player').querySelector('.visualizer');
        
        // Add timeupdate event to update progress
        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Update current time display
            const currentMinutes = Math.floor(audio.currentTime / 60);
            const currentSeconds = Math.floor(audio.currentTime % 60);
            currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
        });
        
        // Set total time once metadata is loaded
        audio.addEventListener('loadedmetadata', () => {
            const totalMinutes = Math.floor(audio.duration / 60);
            const totalSeconds = Math.floor(audio.duration % 60);
            totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        });
        
        // Reset when finished
        audio.addEventListener('ended', () => {
            button.classList.remove('playing');
            progressBar.style.width = '0%';
            if (activeAudio === audio) {
                activeAudio = null;
            }
        });
        
        // Add click handler for play/pause
        button.addEventListener('click', () => {
            // If this audio is currently playing, pause it
            if (!audio.paused) {
                audio.pause();
                button.classList.remove('playing');
                if (activeAudio === audio) {
                    activeAudio = null;
                }
                return;
            }
            
            // If another audio is playing, pause it first
            if (activeAudio && activeAudio !== audio) {
                activeAudio.pause();
                document.querySelectorAll('.play-button').forEach(btn => {
                    if (btn.audioElement === activeAudio) {
                        btn.classList.remove('playing');
                    }
                });
            }
            
            // Play this audio
            audio.play()
                .then(() => {
                    button.classList.add('playing');
                    activeAudio = audio;
                    
                    // Initialize visualizer if needed
                    if (visualizerCanvas) {
                        initializeVisualizer(audio, visualizerCanvas);
                    }
                })
                .catch(error => {
                    console.error("Error playing audio:", error);
                });
        });
        
        // Add click handler for progress bar
        const progressContainer = playerControls.querySelector('.progress-bar');
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            audio.currentTime = clickPosition * audio.duration;
        });
    });
}
// Initialize audio visualizer
function initializeVisualizer(audio, canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Draw the visualizer
    function draw() {
        requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2;
            
            // Use a gradient for visualization
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0f0');
            gradient.addColorStop(0.5, '#0ff');
            gradient.addColorStop(1, '#00f');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    draw();
}

// Load AI Images
function loadAIImages() {
    const imagesContainer = document.getElementById('ai-images-container');
    if (!imagesContainer) return;
    
    // Updated with your exact filenames
    const aiImages = [
        { src: 'images/black cat.jpeg', caption: 'Black Cat', type: 'image' },
        { src: 'images/cat in cybber punk.png', caption: 'Cat in Cyberpunk', type: 'image' },
        { src: 'images/cat rockstar video.mp4', caption: 'Cat Rockstar', type: 'video' },
        { src: 'images/darkplace.jpeg', caption: 'Dark Place', type: 'image' },
        { src: 'images/nature home.jpeg', caption: 'Nature Home', type: 'image' }
    ];
    
    // Remove loading indicator
    const loadingElement = imagesContainer.querySelector('.image-loading');
    if (loadingElement) {
        imagesContainer.removeChild(loadingElement);
    }
    
    // Add images to the container
    aiImages.forEach(item => {
        const imageCard = document.createElement('div');
        imageCard.classList.add('ai-image-card');
        
        if (item.type === 'video') {
            imageCard.classList.add('video-card');
            imageCard.innerHTML = `
                <div class="video-container">
                    <video src="${item.src}" class="ai-video" muted loop></video>
                    <div class="ai-image-overlay">
                        <p>${item.caption}</p>
                    </div>
                </div>
            `;
            
            // Add hover effect to play/pause video
            const video = imageCard.querySelector('video');
            imageCard.addEventListener('mouseenter', () => {
                video.play();
            });
            
            imageCard.addEventListener('mouseleave', () => {
                video.pause();
            });
            
            // Add click event to open modal
            imageCard.addEventListener('click', () => {
                openVideoModal(item.src, item.caption);
            });
        } else {
            imageCard.innerHTML = `
                <div class="ai-image-container">
                    <img src="${item.src}" alt="${item.caption}" class="ai-image">
                    <div class="ai-image-overlay">
                        <p>${item.caption}</p>
                    </div>
                </div>
            `;
            
            // Add click event to open modal
            imageCard.addEventListener('click', () => {
                openImageModal(item.src, item.caption);
            });
        }
        
        imagesContainer.appendChild(imageCard);
    });
}

// Open image modal
function openImageModal(src, caption) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const captionElement = modal.querySelector('.image-caption');
    
    modalImage.src = src;
    captionElement.textContent = caption;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Open video modal
function openVideoModal(src, caption) {
    const modal = document.getElementById('image-modal');
    const modalContent = modal.querySelector('.image-modal-content');
    const captionElement = modal.querySelector('.image-caption');
    
    // Replace image with video
    modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <video id="modal-video" controls autoplay>
            <source src="${src}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="image-caption">${caption}</div>
    `;
    
    // Reinitialize close button
    const closeButton = modalContent.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Initialize avatar matrix effect
function initializeAvatarMatrix() {
    const avatar = document.querySelector('.avatar-matrix');
    if (!avatar) return;
    
    const avatarCanvas = document.createElement('canvas');
    avatarCanvas.width = avatar.clientWidth;
    avatarCanvas.height = avatar.clientHeight;
    avatar.appendChild(avatarCanvas);
    
    const ctx = avatarCanvas.getContext('2d');
    
    // Matrix characters
    const chars = 'ARUN01'.split('');
    const fontSize = 14;
    const columns = avatarCanvas.width / fontSize;
    const rows = Math.ceil(avatarCanvas.height / fontSize);
    
    // Initialize the character grid
    const grid = [];
    for (let i = 0; i < columns; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i][j] = {
                char: chars[Math.floor(Math.random() * chars.length)],
                opacity: Math.random(),
                speed: Math.random() * 0.1 + 0.01
            };
        }
    }
    
    function drawAvatar() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, avatarCanvas.width, avatarCanvas.height);
        
        ctx.font = `${fontSize}px Fira Code, monospace`;
        
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                const cell = grid[i][j];
                
                // Update opacity with a sine wave effect
                cell.opacity += cell.speed;
                const opacity = Math.sin(cell.opacity) * 0.5 + 0.5;
                
                // Set character color
                ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
                
                // Randomly change character
                if (Math.random() < 0.01) {
                    cell.char = chars[Math.floor(Math.random() * chars.length)];
                }
                
                // Draw character
                ctx.fillText(cell.char, i * fontSize, j * fontSize);
            }
        }
        
        requestAnimationFrame(drawAvatar);
    }
    
    drawAvatar();
}

// Initialize modal closers
function initializeModalClosers() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Close modal when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close modal when clicking outside content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize back to top button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Show button when page is scrolled down
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set message and type
    toastMessage.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Animate links on hover
function initializeLinkAnimations() {
    document.querySelectorAll('a:not(nav a)').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transition = 'text-shadow 0.3s ease';
            link.style.textShadow = '0 0 10px var(--neon-green)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.textShadow = 'none';
        });
    });
}
// Add this to your scripts.js file or create a new file called game.js and link it in your HTML


// Completely rewritten mobile-friendly Space Invaders implementation

function initializeSpaceInvadersGame() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return; // Exit if canvas doesn't exist
    
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start-game');
    const gameOverScreen = document.getElementById('game-over');
    const levelUpScreen = document.getElementById('level-up');
    const playAgainButton = document.getElementById('play-again');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const levelElement = document.getElementById('level');
    const livesElement = document.getElementById('lives');
    const gameArea = document.getElementById('game-area');
    
    // Game state
    let gameActive = false;
    let score = 0;
    let level = 1;
    let lives = 3;
    let invaders = [];
    let playerShip = null;
    let bullets = [];
    let enemyBullets = [];
    let lastTime = 0;
    let enemyDirection = 1;
    let shootCooldown = 0;
    let enemyShootInterval = 1000;
    let lastEnemyShot = 0;
    let isMovingLeft = false;
    let isMovingRight = false;
    let touchX = null;
    
    // Ship class
    class Ship {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.speed = 5;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.fill();
            
            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        moveLeft() {
            this.x = Math.max(0, this.x - this.speed);
        }
        
        moveRight() {
            this.x = Math.min(canvas.width - this.width, this.x + this.speed);
        }
        
        moveTo(targetX) {
            // Smooth movement towards target
            const dx = targetX - (this.x + this.width/2);
            
            if (Math.abs(dx) > this.speed) {
                if (dx > 0) this.moveRight();
                else this.moveLeft();
            } else {
                this.x = targetX - this.width/2;
            }
        }
    }
    
    // Invader class
    class Invader {
        constructor(x, y, size, color, points) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.points = points;
            this.alive = true;
        }
        
        draw() {
            if (!this.alive) return;
            
            ctx.fillStyle = this.color;
            
            // Draw alien-like shape
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.size, this.size / 2);
            
            // Draw "tentacles"
            ctx.rect(this.x + this.size * 0.1, this.y + this.size / 2, this.size * 0.15, this.size / 4);
            ctx.rect(this.x + this.size * 0.75, this.y + this.size / 2, this.size * 0.15, this.size / 4);
            ctx.rect(this.x + this.size * 0.3, this.y + this.size / 2, this.size * 0.15, this.size / 3);
            ctx.rect(this.x + this.size * 0.55, this.y + this.size / 2, this.size * 0.15, this.size / 3);
            
            ctx.fill();
            
            // Add eyes
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(this.x + this.size * 0.25, this.y + this.size * 0.25, this.size * 0.1, 0, Math.PI * 2);
            ctx.arc(this.x + this.size * 0.75, this.y + this.size * 0.25, this.size * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        move(dx, dy) {
            this.x += dx;
            this.y += dy;
        }
        
        shoot() {
            if (!this.alive) return null;
            
            return new Bullet(
                this.x + this.size / 2,
                this.y + this.size,
                3,
                10,
                "red",
                5
            );
        }
    }
    
    // Bullet class
    class Bullet {
        constructor(x, y, width, height, color, speed) {
            this.x = x - width / 2;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.speed = speed;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowBlur = 0;
        }
        
        move() {
            this.y -= this.speed;
        }
        
        moveDown() {
            this.y += this.speed;
        }
        
        isOffScreen() {
            return this.y < 0 || this.y > canvas.height;
        }
        
        hasCollided(entity) {
            return (
                this.x < entity.x + entity.width &&
                this.x + this.width > entity.x &&
                this.y < entity.y + entity.height &&
                this.y + this.height > entity.y
            );
        }
        
        hasCollidedWithInvader(invader) {
            if (!invader.alive) return false;
            
            return (
                this.x < invader.x + invader.size &&
                this.x + this.width > invader.x &&
                this.y < invader.y + invader.size &&
                this.y + this.height > invader.y
            );
        }
    }
    
    // Mobile Controls
    function addMobileControls() {
        // Create mobile control container if it doesn't exist
        let mobileControls = document.querySelector('.mobile-controls');
        if (mobileControls) {
            mobileControls.remove();
        }
        
        mobileControls = document.createElement('div');
        mobileControls.className = 'mobile-controls';
        
        // Left button
        const leftBtn = document.createElement('button');
        leftBtn.className = 'mobile-control-btn left-btn';
        leftBtn.innerHTML = '←';
        
        // Touch events for left button
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isMovingLeft = true;
            isMovingRight = false;
        });
        
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            isMovingLeft = false;
        });
        
        // Fire button
        const fireBtn = document.createElement('button');
        fireBtn.className = 'mobile-control-btn fire-btn';
        fireBtn.innerHTML = 'FIRE';
        
        // Touch events for fire button
        fireBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            shootBullet();
        });
        
        // Right button
        const rightBtn = document.createElement('button');
        rightBtn.className = 'mobile-control-btn right-btn';
        rightBtn.innerHTML = '→';
        
        // Touch events for right button
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isMovingRight = true;
            isMovingLeft = false;
        });
        
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            isMovingRight = false;
        });
        
        // Add buttons to mobile controls
        mobileControls.appendChild(leftBtn);
        mobileControls.appendChild(fireBtn);
        mobileControls.appendChild(rightBtn);
        
        // Add mobile controls to game area
        gameArea.appendChild(mobileControls);
    }
    
    // Initialize game
    function init() {
        // Set up event listeners
        if (startButton) {
            startButton.addEventListener('click', startGame);
        }
        
        if (playAgainButton) {
            playAgainButton.addEventListener('click', resetGame);
        }
        
        // Set up keyboard controls
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        // Set up touch controls
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);
        
        // Check if on mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         (window.innerWidth <= 768);
        
        if (isMobile) {
            addMobileControls();
        }
        
        // Set canvas dimensions
        adjustCanvasSize();
        
        // Listen for window resize
        window.addEventListener('resize', adjustCanvasSize);
    }
    
    // Adjust canvas size
    function adjustCanvasSize() {
        const containerWidth = gameArea.clientWidth;
        
        // Calculate dimensions while maintaining aspect ratio
        const maxWidth = Math.min(800, containerWidth - 20);
        const aspectRatio = 16 / 10;
        const maxHeight = maxWidth / aspectRatio;
        
        // Set actual canvas dimensions (for rendering)
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        
        // Set CSS dimensions to match
        canvas.style.width = `${maxWidth}px`;
        canvas.style.height = `${maxHeight}px`;
        
        // If game is active, redraw
        if (gameActive && playerShip) {
            // Adjust player position based on new width
            playerShip.x = (canvas.width / 2) - (playerShip.width / 2);
        }
    }
    
    // Start game
    function startGame() {
        gameActive = true;
        score = 0;
        level = 1;
        lives = 3;
        
        // Hide start button
        if (startButton) {
            startButton.classList.add('hidden');
        }
        
        // Update score display
        updateScore();
        updateLevel();
        updateLives();
        
        // Create player ship
        const shipWidth = Math.max(30, Math.min(40, canvas.width / 15));
        const shipHeight = shipWidth * 0.75;
        playerShip = new Ship(
            canvas.width / 2 - shipWidth / 2,
            canvas.height - shipHeight - 10,
            shipWidth,
            shipHeight,
            '#0f0'
        );
        
        // Initialize invaders
        createInvaders();
        
        // Start game loop
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
    
    // Reset game
    function resetGame() {
        // Clear game elements
        invaders = [];
        bullets = [];
        enemyBullets = [];
        
        // Hide game over screen
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
        
        // Show start button
        if (startButton) {
            startButton.classList.remove('hidden');
        }
    }
    
    // Create invaders
    function createInvaders() {
        invaders = [];
        const rows = Math.min(3 + level - 1, 5); // Cap at 5 rows
        const cols = Math.min(8, Math.floor(canvas.width / 50)); // Adjust columns based on canvas width
        const size = Math.max(20, Math.min(30, canvas.width / 20)); // Responsive size
        const padding = size / 2;
        const startX = (canvas.width - (cols * (size + padding) - padding)) / 2;
        const startY = size;
        
        const colors = ['#ff0099', '#00ffff', '#ff00ff'];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * (size + padding);
                const y = startY + row * (size + padding);
                const color = colors[row % colors.length];
                const points = (rows - row) * 10; // Higher rows are worth more
                
                invaders.push(new Invader(x, y, size, color, points));
            }
        }
    }
    
    // Game loop
    function gameLoop(timestamp) {
        if (!gameActive) return;
        
        // Calculate delta time
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Handle continuous movement
        if (isMovingLeft) {
            playerShip.moveLeft();
        }
        
        if (isMovingRight) {
            playerShip.moveRight();
        }
        
        if (touchX !== null) {
            playerShip.moveTo(touchX);
        }
        
        // Update and draw player
        playerShip.draw();
        
        // Update and draw bullets
        updateBullets(deltaTime);
        
        // Update and draw invaders
        updateInvaders(deltaTime);
        
        // Enemy shooting
        handleEnemyShooting(timestamp);
        
        // Check for end of level
        if (invaders.length > 0 && invaders.every(invader => !invader.alive)) {
            levelUp();
            return;
        }
        
        // Decrement shoot cooldown
        if (shootCooldown > 0) {
            shootCooldown -= deltaTime;
        }
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Update bullets
    function updateBullets(deltaTime) {
        // Update player bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.move();
            bullet.draw();
            
            // Check for collisions with invaders
            for (let j = 0; j < invaders.length; j++) {
                if (bullet.hasCollidedWithInvader(invaders[j])) {
                    // Add points
                    score += invaders[j].points;
                    updateScore();
                    
                    // Remove invader and bullet
                    invaders[j].alive = false;
                    bullets.splice(i, 1);
                    
                    // Add explosion effect
                    createExplosion(invaders[j].x + invaders[j].size / 2, invaders[j].y + invaders[j].size / 2);
                    
                    break;
                }
            }
            
            // Remove bullets that are off screen
            if (bullet && bullet.isOffScreen()) {
                bullets.splice(i, 1);
            }
        }
        
        // Update enemy bullets
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            const bullet = enemyBullets[i];
            bullet.moveDown();
            bullet.draw();
            
            // Check for collision with player
            if (bullet.hasCollided(playerShip)) {
                // Player hit
                lives--;
                updateLives();
                
                // Remove bullet
                enemyBullets.splice(i, 1);
                
                // Game over if out of lives
                if (lives <= 0) {
                    endGame();
                    return;
                }
                
                // Add hit effect
                createExplosion(playerShip.x + playerShip.width / 2, playerShip.y + playerShip.height / 2);
                continue;
            }
            
            // Remove bullets that are off screen
            if (bullet.isOffScreen()) {
                enemyBullets.splice(i, 1);
            }
        }
    }
    
    // Update invaders
    function updateInvaders(deltaTime) {
        let moveDown = false;
        let aliveInvaders = invaders.filter(invader => invader.alive);
        
        if (aliveInvaders.length === 0) return;
        
        // Find leftmost and rightmost invaders
        let leftmost = canvas.width;
        let rightmost = 0;
        
        aliveInvaders.forEach(invader => {
            leftmost = Math.min(leftmost, invader.x);
            rightmost = Math.max(rightmost, invader.x + invader.size);
        });
        
        // Check if invaders hit the edge
        if (rightmost >= canvas.width || leftmost <= 0) {
            enemyDirection *= -1;
            moveDown = true;
        }
        
        // Move invaders
        const speed = 1 + level * 0.3; // Increase speed with level, but not too fast
        invaders.forEach(invader => {
            if (!invader.alive) return;
            
            invader.move(speed * enemyDirection, 0);
            
            if (moveDown) {
                invader.move(0, 20);
            }
            
            // Check if invaders reached the bottom
            if (invader.y + invader.size >= playerShip.y) {
                endGame();
                return;
            }
            
            invader.draw();
        });
    }
    
    // Handle enemy shooting
    function handleEnemyShooting(timestamp) {
        if (timestamp - lastEnemyShot < enemyShootInterval) return;
        
        lastEnemyShot = timestamp;
        
        // Get alive invaders
        const aliveInvaders = invaders.filter(invader => invader.alive);
        if (aliveInvaders.length === 0) return;
        
        // Random invader shoots
        const randomInvader = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
        const bullet = randomInvader.shoot();
        
        if (bullet) {
            enemyBullets.push(bullet);
        }
    }
    
    // Create explosion effect
    function createExplosion(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 200, 0, 0.7)";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
    }
    
    // Level up
    function levelUp() {
        level++;
        updateLevel();
        
        // Show level up message
        if (levelUpScreen) {
            levelUpScreen.classList.remove('hidden');
        }
        
        // Pause the game briefly
        gameActive = false;
        
        // Continue after delay
        setTimeout(() => {
            if (levelUpScreen) {
                levelUpScreen.classList.add('hidden');
            }
            createInvaders();
            
            // Increase enemy shooting frequency
            enemyShootInterval = Math.max(300, 1000 - level * 100);
            
            gameActive = true;
            requestAnimationFrame(gameLoop);
        }, 2000);
    }
    
    // End game
    function endGame() {
        gameActive = false;
        
        if (finalScoreElement) {
            finalScoreElement.textContent = score;
        }
        
        if (gameOverScreen) {
            gameOverScreen.classList.remove('hidden');
        }
    }
    
    // Update score display
    function updateScore() {
        if (scoreElement) {
            scoreElement.textContent = score;
        }
    }
    
    // Update level display
    function updateLevel() {
        if (levelElement) {
            levelElement.textContent = level;
        }
    }
    
    // Update lives display
    function updateLives() {
        if (livesElement) {
            livesElement.textContent = lives;
        }
    }
    
    // Handle keyboard controls
    function handleKeyDown(e) {
        if (!gameActive) return;
        
        if (e.key === 'ArrowLeft') {
            isMovingLeft = true;
            isMovingRight = false;
        } else if (e.key === 'ArrowRight') {
            isMovingRight = true;
            isMovingLeft = false;
        } else if (e.key === ' ' || e.key === 'ArrowUp') {
            shootBullet();
        }
    }
    
    function handleKeyUp(e) {
        if (e.key === 'ArrowLeft') {
            isMovingLeft = false;
        } else if (e.key === 'ArrowRight') {
            isMovingRight = false;
        }
    }
    
    // Handle touch start
    function handleTouchStart(e) {
        if (!gameActive) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
        
        // Auto-fire on touch for mobile
        shootBullet();
    }
    
    // Handle touch move
    function handleTouchMove(e) {
        if (!gameActive) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    }
    
    // Handle touch end
    function handleTouchEnd(e) {
        touchX = null;
    }
    
    // Shoot bullet
    function shootBullet() {
        if (shootCooldown > 0 || !gameActive) return;
        
        const bullet = new Bullet(
            playerShip.x + playerShip.width / 2,
            playerShip.y,
            3,
            10,
            '#0f0',
            10
        );
        
        bullets.push(bullet);
        
        // Set cooldown to prevent rapid fire
        shootCooldown = 300;
    }
    
    // Initialize the game
    init();
}

// Add this to your DOMContentLoaded event listener 
document.addEventListener('DOMContentLoaded', function() {
    initializeSpaceInvadersGame();
});
function initializeInstagramLanding() {
    // Check if visitor is coming from Instagram
    const isFromInstagram = document.referrer.includes('instagram') || 
                           window.location.search.includes('from=instagram');
    
    if (isFromInstagram) {
        // Show a welcome toast for Instagram visitors
        setTimeout(() => {
            showToast('Welcome from Instagram! 👋 Explore my portfolio and play the Power Rangers game!', 'success');
        }, 2000);
        
        // Add a special class to body for Instagram-specific styling if needed
        document.body.classList.add('instagram-visitor');
        
        // Optional: Scroll to game section after a delay
        setTimeout(() => {
            const gameSection = document.getElementById('game');
            if (gameSection) {
                gameSection.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the game section
                gameSection.classList.add('instagram-highlight');
                setTimeout(() => {
                    gameSection.classList.remove('instagram-highlight');
                }, 2000);
            }
        }, 4000);
        
        // Add Instagram back button at bottom
        const backButton = document.createElement('a');
        backButton.href = 'instagram://';
        backButton.classList.add('instagram-back-button');
        backButton.textContent = 'Back to Instagram';
        document.body.appendChild(backButton);
    }
}

// Add this to your DOMContentLoaded event listener in scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing initializations
    initializeInstagramLanding();
});



function initializeInstagramLanding() {
    // Check if visitor is coming from Instagram
    const isFromInstagram = document.referrer.includes('instagram') || 
                           window.location.search.includes('from=instagram');
    
    if (isFromInstagram) {
        // Show a welcome toast for Instagram visitors
        setTimeout(() => {
            showToast('Welcome from Instagram! 👋 Explore my portfolio and play the Power Rangers game!', 'success');
        }, 2000);
        
        // Add a special class to body for Instagram-specific styling if needed
        document.body.classList.add('instagram-visitor');
        
        // Optional: Scroll to game section after a delay
        setTimeout(() => {
            const gameSection = document.getElementById('game');
            if (gameSection) {
                gameSection.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the game section
                gameSection.classList.add('instagram-highlight');
                setTimeout(() => {
                    gameSection.classList.remove('instagram-highlight');
                }, 2000);
            }
        }, 4000);
        
        // Add Instagram back button at bottom
        const backButton = document.createElement('a');
        backButton.href = 'instagram://';
        backButton.classList.add('instagram-back-button');
        backButton.textContent = 'Back to Instagram';
        document.body.appendChild(backButton);
    }
}

// Add this to your DOMContentLoaded event listener in scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing initializations
    initializeInstagramLanding();
});

// Add this to your scripts.js file
function initializeGrumpyCatChatbot() {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-message');
    
    // Arrogant cat responses
    const catResponses = [
        "Do I look like I care? Because I don't.",
        "Wow, that's so interesting... said no cat ever.",
        "I was having a great nap until you decided to talk.",
        "The audacity of humans never ceases to amaze me.",
        "Let me check my schedule... nope, don't care.",
        "I would answer, but I'm busy ignoring you.",
        "Is this conversation really necessary?",
        "Humans and their silly questions...",
        "That deserves a solid 'meh' from me.",
        "I'd rather be licking my fur than answering that.",
        "Your question is almost as interesting as watching paint dry.",
        "Oh look, a human wanting attention. How unique.",
        "That's nice. Anyway, where's my food?",
        "The only thing I care about is when dinner is served.",
        "I'm going to pretend you didn't say that.",
        "Fascinating story. Tell it to someone who cares.",
        "I just remembered I don't have to listen to this.",
        "Excuse me while I completely disregard what you just said.",
        "Are you still talking? I stopped listening ages ago.",
        "That's a very human thing to say. Boring."
    ];
    
    // Questions the cat might recognize
    const specialResponses = {
        "who are you": "I'm Mittens, the most superior cat in existence. Not that you needed to know.",
        "what's your name": "Mittens. Remember it, because I won't answer to anything else.",
        "hello": "Oh great, you know basic greetings. Want a treat?",
        "hi": "Yes, hello, whatever. Are you here to serve me or just waste my time?",
        "food": "Finally, a topic worth discussing. Where is it?",
        "treat": "Now you're speaking my language. Hand it over and no one gets scratched.",
        "pet": "You may touch me for exactly 2.5 pets. Any more and I attack.",
        "love": "That's a strong word. I tolerate you at best.",
        "sorry": "As you should be. I may forgive you in 3-5 business days.",
        "cat": "Yes, I'm a cat. Your observational skills are truly remarkable.",
        "dog": "Don't mention those slobbering beasts in my presence."
    };
    
    // Function to add message to chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        
        messageDiv.appendChild(messagePara);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to get cat response
    function getCatResponse(userMessage) {
        const lowercaseMessage = userMessage.toLowerCase();
        
        // Check for special responses
        for (const [key, value] of Object.entries(specialResponses)) {
            if (lowercaseMessage.includes(key)) {
                return value;
            }
        }
        
        // If no special response matches, return random response
        return catResponses[Math.floor(Math.random() * catResponses.length)];
    }
    
    // Handle send button click
    function handleSend() {
        const userMessage = userMessageInput.value.trim();
        
        if (userMessage) {
            // Add user message
            addMessage(userMessage, true);
            
            // Clear input
            userMessageInput.value = '';
            
            // Get and add cat response after a short delay
            setTimeout(() => {
                const botResponse = getCatResponse(userMessage);
                addMessage(botResponse);
            }, 500 + Math.random() * 1000); // Random delay between 500ms and 1500ms
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', handleSend);
    
    userMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
    
    // Add to navigation menu
    const navList = document.querySelector('nav ul');
    if (navList) {
        const chatLink = document.createElement('li');
        chatLink.innerHTML = '<a href="#chatbot">Chat</a>';
        navList.appendChild(chatLink);
    }
}

// Add this to your DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing initializations
    initializeGrumpyCatChatbot();
});
// Universe of Knowledge Chatbot
function initializeUniverseChatbot() {
    const topicButtons = document.querySelectorAll('.topic-btn');
    const universeChat = document.getElementById('universe-chat');
    const chatMessages = document.getElementById('universe-chat-messages');
    const topicTitle = document.getElementById('universe-topic-title');
    const selectedTopicSpan = document.getElementById('selected-topic');
    const userMessageInput = document.getElementById('universe-user-message');
    const sendButton = document.getElementById('universe-send-message');
    const closeButton = document.getElementById('close-universe-chat');
    
    let currentTopic = '';
    
    // Topic-specific responses and intros
    const topicData = {
        quantum: {
            title: "Quantum Computing Expert",
            intro: "Hi there! I'm here to explain quantum computing in simple terms. Think of it like a magical computer that can try all possible answers at once, instead of one at a time like normal computers!",
            keywords: ["qubit", "superposition", "entanglement", "quantum gate", "quantum supremacy", "decoherence", "Shor's algorithm", "quantum bit", "quantum state", "quantum computer"]
        },
        spirituality: {
            title: "Spirituality Guide",
            intro: "Hello! Let me help you understand spirituality. It's like exploring the invisible side of life - the part that makes you feel connected to something bigger than yourself!",
            keywords: ["meditation", "mindfulness", "consciousness", "soul", "enlightenment", "awareness", "being", "presence", "divine", "transcendence"]
        },
        rocket: {
            title: "Rocket Science Explainer",
            intro: "Hi there! I'll explain rocket science like you're five. Imagine throwing a really heavy balloon filled with air - that's basically how rockets work, but with fire instead of air!",
            keywords: ["propulsion", "orbit", "thrust", "payload", "trajectory", "rocket engine", "fuel", "gravity", "space", "aerodynamics"]
        },
        ai: {
            title: "AI Simplifier",
            intro: "Hello! I'm here to explain AI in simple terms. Think of AI as teaching computers to learn from examples, just like how you learn to recognize cats after seeing many cat pictures!",
            keywords: ["machine learning", "neural network", "deep learning", "algorithm", "training", "dataset", "model", "prediction", "classification", "robot"]
        },
        climate: {
            title: "Climate Science Educator",
            intro: "Hi! I'll explain climate science in easy terms. Imagine Earth wearing a blanket that keeps getting thicker - that's like greenhouse gases trapping heat and changing our weather!",
            keywords: ["global warming", "greenhouse gases", "carbon dioxide", "temperature", "atmosphere", "renewable energy", "fossil fuels", "emissions", "sustainability", "sea level"]
        },
        neuroscience: {
            title: "Brain Science Simplifier",
            intro: "Hello! Let me explain how your brain works in simple terms. Imagine your brain as a super-busy city with billions of tiny messengers (neurons) sending letters (signals) to each other!",
            keywords: ["neuron", "brain", "synapse", "neurotransmitter", "cognition", "memory", "consciousness", "nervous system", "neural pathway", "brain region"]
        },
        economics: {
            title: "Economics Guide",
            intro: "Hi there! I'll explain economics like you're five. Economics is like understanding how a giant cookie jar works - who gets cookies, how many, and what happens when we run out!",
            keywords: ["market", "supply", "demand", "inflation", "currency", "trade", "capitalism", "recession", "GDP", "economic growth"]
        },
        genetics: {
            title: "Genetic Engineering Expert",
            intro: "Hello! I'll explain genetic engineering as if you're five. Imagine genes as instruction books for building living things, and we're learning to carefully change some of those instructions!",
            keywords: ["DNA", "genome", "mutation", "gene editing", "CRISPR", "inheritance", "genetic modification", "chromosome", "sequence", "cloning"]
        },
        philosophy: {
            title: "Philosophy of Mind Guide",
            intro: "Hi! Let's explore philosophy of mind in simple terms. It's like asking: what is a thought made of? Are your mind and brain the same thing? Can computers think like people do?",
            keywords: ["consciousness", "mind", "dualism", "identity", "qualia", "thought experiment", "free will", "determinism", "perception", "experience"]
        },
        international: {
            title: "International Relations Explainer",
            intro: "Hello! I'll explain international relations simply. Imagine countries as kids in a playground - some are friends, some argue, some share toys, and there are playground rules they try to follow!",
            keywords: ["diplomacy", "sovereignty", "treaty", "foreign policy", "war", "peace", "alliance", "nation", "geopolitics", "international law"]
        }
    };
    
    // General explanations for each topic
    const topicExplanations = {
        quantum: [
            "Quantum computers are like magic dice that show all numbers at once until you look at them. Normal computers can only show one number at a time.",
            "Think of quantum bits or 'qubits' as super-coins. Regular coins show heads OR tails, but quantum coins can be heads AND tails at the same time until you check!",
            "Quantum entanglement is like having two magic coins. When you flip one and it shows heads, the other instantly shows tails, even if it's far away!",
            "Quantum computers might someday solve problems in minutes that would take regular computers longer than the universe has existed!",
            "Quantum computing is like having a library where you can check all books at once instead of one at a time."
        ],
        spirituality: [
            "Spirituality is like listening to the quiet music of life that's always playing underneath all the noise.",
            "Meditation is like giving your mind a bath - washing away busy thoughts to see what's underneath.",
            "Spiritual practices are like glasses that help you see the invisible connections between everything.",
            "Your spirit is like an invisible friend that's always with you, it's the 'you' behind your thoughts and feelings.",
            "Different spiritual paths are like different roads that all lead to the same mountain top."
        ],
        rocket: [
            "Rockets work by pushing gas out one end really fast, which pushes the rocket in the opposite direction - just like letting go of a balloon!",
            "Getting to space is like climbing a really tall mountain, but gravity is trying to pull you back down the whole time.",
            "Orbiting Earth is actually like falling around the planet. You're falling toward Earth, but moving forward so fast that you keep missing it!",
            "Rocket fuel is like super powerful car gas, but rockets need to carry their own oxygen too because there's no air in space.",
            "Multi-stage rockets are like using a big spring to jump, then using a smaller spring mid-air to jump even higher."
        ],
        ai: [
            "AI learns from examples, just like how you learn to recognize dogs after seeing many dogs. Show it thousands of pictures, and it figures out 'dog patterns'!",
            "Neural networks in AI are like a game of Telephone with thousands of players, except they can adjust how they pass messages to get better results.",
            "Machine learning is like teaching a computer to ride a bike - it falls a lot at first, but eventually learns the right balance by practicing.",
            "AI doesn't actually 'think' like people do. It's more like a really good parrot that's seen so many examples it can predict what to say next.",
            "Creating AI is like raising a very literal-minded child that only understands exactly what you show it, not what you meant to show it."
        ],
        climate: [
            "Climate change is like slowly turning up the heat in your house - some rooms get hotter than others, and things start acting differently.",
            "Greenhouse gases are like a blanket around Earth. We need some blanket to stay warm, but too much and we get too hot!",
            "Carbon dioxide is like invisible dirt we put in the sky when we burn things like gasoline and coal. It builds up because trees can't clean it all.",
            "Renewable energy is like having a magical apple tree that gives you apples forever, instead of a basket of apples that eventually runs out.",
            "Climate scientists are like weather detectives, looking for clues about how our planet's temperature is changing and why."
        ],
        neuroscience: [
            "Your brain is like a super-computer made of 86 billion tiny parts called neurons, all sending messages to each other.",
            "Memories are like footprints in sand - recent ones are clear, but older ones can get washed away or changed over time.",
            "Learning something new is like making a path through a forest. The more you walk the path, the easier it becomes to follow.",
            "Different parts of your brain have different jobs - one part helps you see, another helps you move, another helps you feel emotions.",
            "Your brain uses electricity and chemicals to send messages, kind of like a really complicated text message system in your head."
        ],
        economics: [
            "Economics is about how people choose to use things that are limited, like money or time or cookies in a jar.",
            "Supply and demand is like a seesaw - when lots of people want something scarce, the price goes up; when few people want something abundant, the price goes down.",
            "Money is like tickets at a carnival - it's not valuable by itself, but we agree to trade it for fun rides and cotton candy.",
            "A country's economy is like a giant piggy bank that everyone puts into and takes out of in different ways.",
            "Inflation is like a sneaky thief that makes your money buy less stuff over time."
        ],
        genetics: [
            "DNA is like a cookbook with recipes to build every part of your body, from your eye color to how tall you'll be.",
            "Genes are like specific recipes in that cookbook - maybe the recipe for your hair or your nose shape.",
            "Genetic engineering is like carefully changing one ingredient in a recipe to make the cake turn out differently.",
            "CRISPR is like magical scissors that can cut exactly one specific word out of a book and replace it with a different word.",
            "Mutations are like spelling mistakes in the DNA cookbook. Some don't matter, some make the recipe better, and some make it not work."
        ],
        philosophy: [
            "Philosophy of mind asks: is your mind like the music a piano plays, or is it the piano itself?",
            "Consciousness is like the light that's on when you're awake - we all experience it, but it's hard to explain what it actually is.",
            "The mind-body problem asks if your thoughts and feelings are just brain activity or something more, like asking if a story is just ink on paper or something more.",
            "Free will is questioning whether you really choose your ice cream flavor, or if it was already determined by your past experiences and brain chemistry.",
            "The 'hard problem of consciousness' asks why we experience feelings at all - why does stubbing your toe feel like something rather than nothing?"
        ],
        international: [
            "Countries interact like people at a big party - some are friends, some avoid each other, and they all follow certain party rules to get along.",
            "Diplomacy is like using words instead of fists to solve problems between countries.",
            "International law is like playground rules that countries agree to follow, but there's no big teacher to send them to timeout if they break the rules.",
            "Trade between countries is like trading lunch items with friends - everyone gives something and gets something they want more.",
            "Global challenges like climate change are like a leak in a boat everyone shares - countries need to work together to fix it, or everyone gets wet!"
        ]
    };
    
    // Function to add message to chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('universe-message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        
        messageDiv.appendChild(messagePara);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }
    
    // Function to get topic response
    function getTopicResponse(topic, userMessage) {
        const lowercaseMessage = userMessage.toLowerCase();
        
        // Check for topic-specific keywords
        const topicInfo = topicData[topic];
        for (const keyword of topicInfo.keywords) {
            if (lowercaseMessage.includes(keyword.toLowerCase())) {
                // If keyword found, return a related explanation
                const explanations = topicExplanations[topic];
                const explanation = explanations[Math.floor(Math.random() * explanations.length)];
                return explanation;
            }
        }
        
        // If no specific keywords found, give a general explanation
        const explanations = topicExplanations[topic];
        return explanations[Math.floor(Math.random() * explanations.length)];
    }
    
    // Initialize topic buttons
    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get selected topic
            currentTopic = button.getAttribute('data-topic');
            
            // Update active button
            topicButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update chat header and selected topic
            const topicInfo = topicData[currentTopic];
            topicTitle.textContent = topicInfo.title;
            selectedTopicSpan.textContent = currentTopic.replace(/^\w/, c => c.toUpperCase());
            
            // Clear previous messages
            chatMessages.innerHTML = '';
            
            // Add intro message
            addMessage(topicInfo.intro);
            
            // Show chat container
            universeChat.classList.remove('hidden');
            
            // Focus input
            userMessageInput.focus();
        });
    });
    
    // Handle send button click
    function handleSend() {
        const userMessage = userMessageInput.value.trim();
        
        if (userMessage && currentTopic) {
            // Add user message
            addMessage(userMessage, true);
            
            // Clear input
            userMessageInput.value = '';
            
            // Get and add bot response after a short delay
            setTimeout(() => {
                const botResponse = getTopicResponse(currentTopic, userMessage);
                addMessage(botResponse);
            }, 500 + Math.random() * 1000);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', handleSend);
    
    userMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
    
    // Close button
    closeButton.addEventListener('click', () => {
        universeChat.classList.add('hidden');
        topicButtons.forEach(btn => btn.classList.remove('active'));
    });
    
    // Add to navigation menu
    const navList = document.querySelector('nav ul');
    if (navList) {
        const universeLink = document.createElement('li');
        universeLink.innerHTML = '<a href="#universe">Universe</a>';
        navList.appendChild(universeLink);
    }
}

// Add this to your DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing initializations
    initializeUniverseChatbot();
});
// Add this to your scripts.js file

// Knowledge-Centric AI Chatbot System
// OpenAI-Powered AI Chatbot System
// OpenAI-Powered AI Chatbot System (through backend proxy)
function initializeAIChatbotSystem() {
    // Backend URL - change this when you deploy the backend
    const BACKEND_URL = 'http://localhost:3001';
    
    // Get DOM elements
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-message');
    
    if (!chatMessages || !userMessageInput || !sendButton) {
        console.error('Could not find chatbot elements in the DOM');
        return;
    }
    
    // Clear previous messages
    chatMessages.innerHTML = '';
    
    // Update the chat header to Matrix theme
    const chatbotSection = document.getElementById('chatbot');
    if (chatbotSection) {
        const header = chatbotSection.querySelector('h2');
        if (header) header.textContent = "Matrix Chat";
        
        const chatHeader = chatbotSection.querySelector('.chat-header h3');
        if (chatHeader) chatHeader.textContent = "Neo - Guide to the Matrix";
    }
    
    // Add initial message
    addMessage(chatMessages, "The Matrix has you... What do you seek?", false);
    
    // Function to add message to chat
    function addMessage(container, text, isUser = false, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        
        if (isLoading) messageDiv.classList.add('loading');
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        
        messageDiv.appendChild(messagePara);
        container.appendChild(messageDiv);
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
        
        return messageDiv.id = 'msg-' + Date.now();
    }
    
    // Function to get Matrix response from backend
    async function getMatrixResponse(message) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/chat/matrix`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) throw new Error('Server error');
            
            const data = await response.json();
            return data.reply;
            
        } catch (error) {
            console.error('Error connecting to Matrix:', error);
            
            // Fallback responses if server is unavailable
            const fallbackResponses = [
                "The Matrix has you...",
                "There is no spoon.",
                "Follow the white rabbit.",
                "Welcome to the desert of the real.",
                "Free your mind.",
                "Everything that has a beginning has an end."
            ];
            
            return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
    }
    
    // Handle send button click
    async function handleSend() {
        const userMessage = userMessageInput.value.trim();
        
        if (userMessage) {
            // Add user message
            addMessage(chatMessages, userMessage, true);
            
            // Clear input
            userMessageInput.value = '';
            
            // Add loading indicator
            const loadingId = addMessage(chatMessages, "...", false, true);
            
            try {
                // Get Matrix response
                const response = await getMatrixResponse(userMessage);
                
                // Remove loading message
                const loadingMsg = document.getElementById(loadingId);
                if (loadingMsg) loadingMsg.remove();
                
                // Add bot response
                addMessage(chatMessages, response, false);
                
            } catch (error) {
                console.error('Error in chat:', error);
                
                // Remove loading message
                const loadingMsg = document.getElementById(loadingId);
                if (loadingMsg) loadingMsg.remove();
                
                // Add error message
                addMessage(chatMessages, "Error connecting to the Matrix. Try again later.", false);
            }
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', handleSend);
    
    userMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
    
    // Test connection to backend
    fetch(`${BACKEND_URL}/health`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                console.log('✅ Connected to Matrix AI backend!');
            }
        })
        .catch(error => {
            console.warn('⚠️ Not connected to Matrix backend:', error);
        });
}

// Matrix & Universe AI Chatbot Integration
document.addEventListener('DOMContentLoaded', function() {
  // Replace the original grumpy cat with Matrix AI
  initializeMatrixChatbot();
  
  // Connect Universe chatbot to backend
  enhanceUniverseChatbot();
  
  // Backend URL - update this when you deploy the backend
  const BACKEND_URL = 'http://localhost:3001';

  // Matrix Chatbot Implementation
  function initializeMatrixChatbot() {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-message');
    
    if (!chatMessages || !userMessageInput || !sendButton) return;
    
    // Clear existing messages
    chatMessages.innerHTML = '';
    
    // Add initial bot message
    addMessage(chatMessages, "The Matrix has you... What do you seek?", false);
    
    // Handle send button click
    function handleSend() {
      const userMessage = userMessageInput.value.trim();
      
      if (userMessage) {
        // Add user message
        addMessage(chatMessages, userMessage, true);
        
        // Clear input
        userMessageInput.value = '';
        
        // Show loading state
        const loadingId = addMessage(chatMessages, "...", false, true);
        
        // Call backend API
        fetchMatrixResponse(userMessage)
          .then(response => {
            // Remove loading message
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();
            
            // Add bot response
            addMessage(chatMessages, response, false);
          });
      }
    }
    
    // Event listeners
    sendButton.addEventListener('click', handleSend);
    
    userMessageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });
    
    // Update section UI
    const chatbotSection = document.getElementById('chatbot');
    if (chatbotSection) {
      const header = chatbotSection.querySelector('h2');
      if (header) header.textContent = "Matrix Chat";
      
      const chatHeader = chatbotSection.querySelector('.chat-header h3');
      if (chatHeader) chatHeader.textContent = "Neo - Guide to the Matrix";
    }
  }
  
  // Enhance Universe Chatbot
  function enhanceUniverseChatbot() {
    // Backend URL - change this when you deploy the backend
    const BACKEND_URL = 'http://localhost:3001';
    
    // Get DOM elements
    const universeChat = document.getElementById('universe-chat');
    const topicBtns = document.querySelectorAll('.topic-btn');
    const chatMessages = document.getElementById('universe-chat-messages');
    const userInput = document.getElementById('universe-user-message');
    const sendButton = document.getElementById('universe-send-message');
    const topicTitle = document.getElementById('universe-topic-title');
    const selectedTopic = document.getElementById('selected-topic');
    
    if (!universeChat || !topicBtns.length || !chatMessages || !userInput || !sendButton) {
        console.error('Could not find universe chatbot elements in the DOM');
        return;
    }
    
    // Store current topic
    let currentTopic = '';
    
    // Map topic buttons to backend topic values
    const topicMap = {
        'quantum': 'quantum physics',
        'spirituality': 'spirituality',
        'rocket': 'rocket science',
        'ai': 'artificial intelligence',
        'climate': 'climate science',
        'neuroscience': 'neuroscience',
        'economics': 'economics',
        'genetics': 'genetic engineering',
        'philosophy': 'philosophy',
        'international': 'international relations'
    };
    
    // Topic button click handler
    topicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active state
            topicBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Get topic
            currentTopic = btn.dataset.topic;
            
            // Update UI
            universeChat.classList.remove('hidden');
            if (topicTitle) topicTitle.textContent = btn.textContent + " Expert";
            if (selectedTopic) selectedTopic.textContent = btn.textContent;
            
            // Clear chat
            chatMessages.innerHTML = '';
            
            // Add welcome message
            addUniverseMessage("Hello! I'm here to explain " + btn.textContent + " in simple terms. What would you like to know?", false);
        });
    });
    
    // Function to add message to universe chat
    function addUniverseMessage(text, isUser = false, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('universe-message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        
        if (isLoading) messageDiv.classList.add('loading');
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        
        messageDiv.appendChild(messagePara);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }
    
    // Get universe response from backend
    async function getUniverseResponse(message, topic) {
        try {
            // Convert frontend topic to backend topic
            const backendTopic = topicMap[topic] || topic;
            
            const response = await fetch(`${BACKEND_URL}/api/chat/universe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    message: message,
                    topic: backendTopic
                })
            });
            
            if (!response.ok) throw new Error('Server error');
            
            const data = await response.json();
            return data.reply;
            
        } catch (error) {
            console.error('Error connecting to Universe:', error);
            
            // Fallback responses based on topic
            const fallbacks = {
                'quantum': "Quantum physics is like a game where tiny particles can be in multiple places at once until you look at them.",
                'spirituality': "Spirituality is about finding meaning beyond the physical world, connecting to something larger than yourself.",
                'rocket': "Rockets work by pushing stuff out one end really fast, which pushes the rocket in the opposite direction.",
                'ai': "AI learns patterns from data, similar to how humans learn, but it needs lots more examples.",
                'climate': "Climate science studies how Earth's atmosphere, oceans, and land interact to create weather patterns over long periods.",
                'neuroscience': "Your brain has billions of tiny cells called neurons that talk to each other using electrical and chemical signals.",
                'economics': "Economics is about how people make choices when there aren't enough resources for everything everyone wants.",
                'genetics': "Genetics is like a cookbook for living things. DNA is the recipe that tells your body how to build and maintain itself.",
                'philosophy': "Philosophy asks the big questions about existence, knowledge, values, reason, mind, and language.",
                'international': "International relations is about how countries interact with each other through cooperation, conflict, and everything in between."
            };
            
            return fallbacks[topic] || "The universe's secrets are vast and complex. What specifically would you like to understand?";
        }
    }
    
    // Send message function
    async function sendUniverseMessage() {
        const message = userInput.value.trim();
        if (!message || !currentTopic) return;
        
        // Add user message
        addUniverseMessage(message, true);
        
        // Clear input
        userInput.value = '';
        
        // Show loading state
        const loadingMsg = addUniverseMessage("Searching the cosmic database...", false, true);
        
        try {
            // Get response from universe
            const response = await getUniverseResponse(message, currentTopic);
            
            // Remove loading message
            if (loadingMsg) loadingMsg.remove();
            
            // Add bot response
            addUniverseMessage(response, false);
            
        } catch (error) {
            console.error('Error in universe chat:', error);
            
            // Remove loading message
            if (loadingMsg) loadingMsg.remove();
            
            // Add error message
            addUniverseMessage("The cosmic database is temporarily unavailable. Please try again later.", false);
        }
    }
    
    // Event listeners for sending messages
    sendButton.addEventListener('click', () => sendUniverseMessage());
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUniverseMessage();
    });
    
    // Check backend connection
    fetch(`${BACKEND_URL}/health`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                console.log('✅ Connected to Universe AI backend!');
            }
        })
        .catch(error => {
            console.warn('⚠️ Not connected to Universe backend:', error);
        });
  }
});

// Make sure to call the new chatbot functions when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Use the AI-powered chatbots instead of the old ones
    initializeAIChatbotSystem(); // Instead of initializeGrumpyCatChatbot
    enhanceUniverseChatbot();    // Enhanced version that connects to backend
    
    // Your other existing initialization code...
});