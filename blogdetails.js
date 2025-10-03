// blogdetails.js

// Get blog ID from URL parameters
function getBlogIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format category for display
function formatCategory(category) {
    if (!category) return 'General';
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Fetch and display blog details
async function fetchBlogDetails() {
    const blogId = getBlogIdFromUrl();
    
    if (!blogId) {
        showError('Blog ID not found in URL');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/blogs/public/${blogId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch blog');
        }

        const blog = data.data;
        displayBlogContent(blog);
        
        // Fetch related blogs after main blog is loaded
        fetchRelatedBlogs(blog.category, blogId);
        
    } catch (error) {
        console.error('Error fetching blog:', error);
        showError('Failed to load blog content. Please try again later.');
    } finally {
        hideLoadingSpinner();
    }
}

// Display blog content
function displayBlogContent(blog) {
    // Update page title
    document.title = `${blog.title} - ThunderGits`;
    
    // Update blog header
    const blogHeader = document.getElementById('blogHeader');
    blogHeader.innerHTML = `
        <div class="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up">
            <div class="inline-block px-3 py-1 bg-pink-600 text-white text-sm font-semibold rounded-full mb-4">
                ${formatCategory(blog.category)}
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                ${blog.title}
            </h1>
            <div class="flex justify-center items-center space-x-6 text-theme-textLight text-sm">
                <div class="flex items-center">
                    <i class="fas fa-user mr-2"></i>
                    <span>${blog.author?.username || 'ThunderGits Team'}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    <span>${formatDate(blog.publishedAt)}</span>
                </div>
                ${blog.readTime ? `
                    <div class="flex items-center">
                        <i class="fas fa-clock mr-2"></i>
                        <span>${blog.readTime} min read</span>
                    </div>
                ` : ''}
                <div class="flex items-center">
                    <i class="fas fa-eye mr-2"></i>
                    <span>${blog.views || 0} views</span>
                </div>
            </div>
        </div>
    `;

    // Update featured image
    const featuredImageContainer = document.getElementById('featuredImageContainer');
    if (blog.featuredImage) {
        featuredImageContainer.innerHTML = `
            <img src="${blog.featuredImage || './assets/blogimg1.jpg'}" 
                 alt="${blog.title}" 
                 class="w-full h-96 object-cover rounded-lg shadow-lg"
                 onerror="this.src='./assets/blogimg1.jpg'"
                 data-aos="zoom-in">
        `;
    } else {
        featuredImageContainer.style.display = 'none';
    }

    // Update blog content
    const blogBody = document.getElementById('blogBody');
    blogBody.innerHTML = `
        <div data-aos="fade-up" data-aos-delay="200">
            ${blog.excerpt ? `<div class="text-xl text-gray-600 mb-8 italic border-l-4 border-pink-500 pl-6">${blog.excerpt}</div>` : ''}
            <div class="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                ${formatBlogContent(blog.content)}
            </div>
        </div>
    `;

    // Update author info
    const authorInfo = document.getElementById('authorInfo');
    authorInfo.innerHTML = `
        <div data-aos="fade-up" data-aos-delay="300">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    ${(blog.author?.username || 'TG').charAt(0).toUpperCase()}
                </div>
                <div>
                    <h4 class="font-semibold text-gray-900">${blog.author?.username || 'ThunderGits Team'}</h4>
                    <p class="text-gray-600">${blog.author?.email || 'Content Creator at ThunderGits'}</p>
                </div>
            </div>
        </div>
    `;

    // Update tags
    const blogTags = document.getElementById('blogTags');
    if (blog.tags && blog.tags.length > 0) {
        blogTags.innerHTML = `
            <div data-aos="fade-up" data-aos-delay="400">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div class="flex flex-wrap gap-2">
                    ${blog.tags.map(tag => `
                        <span class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-pink-100 hover:text-pink-700 transition-colors cursor-pointer">
                            #${tag}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        blogTags.style.display = 'none';
    }
}

// Format blog content (convert line breaks to paragraphs)
function formatBlogContent(content) {
    if (!content) return '';
    
    // Split content by double line breaks to create paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map(paragraph => {
        // Handle single line breaks within paragraphs
        const formattedParagraph = paragraph.replace(/\n/g, '<br>');
        return `<p class="mb-6">${formattedParagraph}</p>`;
    }).join('');
}

// Fetch and display all blogs
async function fetchRelatedBlogs(category, currentBlogId) {
    try {
        const response = await fetch(`http://localhost:5000/api/blogs/published?limit=20&sortBy=publishedAt&sortOrder=desc`);
        const data = await response.json();
        
        if (data.success && data.data) {
            // Filter out current blog and display all others
            const allBlogs = data.data.filter(blog => blog._id !== currentBlogId);
            
            displayRelatedBlogs(allBlogs);
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
        // Hide related section if error
        document.getElementById('relatedBlogs').style.display = 'none';
    }
}

// Display all blogs with show more functionality
function displayRelatedBlogs(blogs) {
    const container = document.getElementById('relatedBlogsContainer');
    
    if (blogs.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-blog text-gray-400 text-6xl mb-4"></i>
                <p class="text-gray-500 text-lg">No articles found</p>
            </div>
        `;
        return;
    }
    
    // Initially show 6 blogs
    let visibleCount = 6;
    
    function renderBlogs() {
        const blogsToShow = blogs.slice(0, visibleCount);
        
        container.innerHTML = `
            ${blogsToShow.map((blog, index) => `
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="${(index % 6) * 100}">
                    <img src="${blog.featuredImage || './assets/blogimg1.jpg'}" 
                         alt="${blog.title}" 
                         class="w-full h-48 object-cover"
                         onerror="this.src='./assets/blogimg1.jpg'">
                    <div class="p-6">
                        <div class="text-xs uppercase text-pink-600 font-semibold mb-2">
                            ${formatCategory(blog.category)}
                        </div>
                        <h3 class="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-pink-600 transition-colors">
                            <a href="./blogdetails.html?id=${blog._id}">${blog.title}</a>
                        </h3>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                            ${blog.excerpt || 'No description available'}
                        </p>
                        <div class="flex justify-between items-center text-xs text-gray-500 mb-4">
                            <span>${formatDate(blog.publishedAt)}</span>
                            ${blog.readTime ? `<span>${blog.readTime} min read</span>` : ''}
                        </div>
                        <div class="mt-auto">
                            <a href="./blogdetails.html?id=${blog._id}" 
                               class="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 transition-colors">
                                Read More
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            `).join('')}
            
            ${blogs.length > visibleCount ? `
                <div class="col-span-full text-center mt-8">
                    <button id="showMoreBlogs" class="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-md font-medium hover:opacity-90 transition-all">
                        Show More Articles (${blogs.length - visibleCount} remaining)
                    </button>
                </div>
            ` : ''}
            
            ${blogs.length > 6 && visibleCount >= blogs.length ? `
                <div class="col-span-full text-center mt-8">
                    <button id="showLessBlogs" class="bg-gray-500 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-600 transition-all">
                        Show Less
                    </button>
                </div>
            ` : ''}
        `;
        
        // Add event listeners for show more/less buttons
        const showMoreBtn = document.getElementById('showMoreBlogs');
        const showLessBtn = document.getElementById('showLessBlogs');
        
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => {
                visibleCount = Math.min(visibleCount + 6, blogs.length);
                renderBlogs();
                // Smooth scroll to new content
                setTimeout(() => {
                    showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            });
        }
        
        if (showLessBtn) {
            showLessBtn.addEventListener('click', () => {
                visibleCount = 6;
                renderBlogs();
                // Scroll back to top of articles section
                document.getElementById('relatedBlogs').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
    
    renderBlogs();
}

// Show error message
function showError(message) {
    const blogContent = document.getElementById('blogContent');
    blogContent.innerHTML = `
        <div class="max-w-4xl mx-auto px-6 text-center py-20">
            <i class="fas fa-exclamation-triangle text-red-500 text-6xl mb-6"></i>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p class="text-gray-600 mb-8">${message}</p>
            <a href="./index.html" 
               class="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-all">
                <i class="fas fa-arrow-left mr-2"></i>
                Back to Home
            </a>
        </div>
    `;
    
    // Hide other sections
    document.getElementById('blogHeader').style.display = 'none';
    document.getElementById('relatedBlogs').style.display = 'none';
}

// Hide loading spinner
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Mobile menu toggle function
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.style.opacity = 0;
        setTimeout(() => {
            menu.style.opacity = 1;
        }, 10);
    } else {
        menu.style.opacity = 0;
        setTimeout(() => {
            menu.classList.add('hidden');
        }, 300);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchBlogDetails();
});
