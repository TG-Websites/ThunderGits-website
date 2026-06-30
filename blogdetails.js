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
    if (!category) return 'Insight';
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Interactive Grid Logic
function initHeroGrid() {
    const gridContainer = document.getElementById('hero-grid');
    if (!gridContainer) return;
    
    function buildGrid() {
        gridContainer.innerHTML = '';
        const columns = Math.ceil(window.innerWidth / 50);
        const rows = Math.ceil(window.innerHeight / 50);
        const totalCells = columns * rows;
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'hero-cell w-[50px] h-[50px] border-[0.5px] border-white/5 transition-all duration-700 hover:bg-white/10 hover:duration-0';
            gridContainer.appendChild(cell);
        }
    }
    buildGrid();
    window.addEventListener('resize', buildGrid);
}

// Fetch and display blog details
async function fetchBlogDetails() {
    const blogId = getBlogIdFromUrl();
    
    if (!blogId) {
        showError('Blog ID not found in URL');
        return;
    }

    try {
        const response = await fetch(`https://api.thundergits.com/api/blogs/public/${blogId}`);
        
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
    
    // Update blog header elements
    const blogTitle = document.getElementById('blogTitle');
    const blogCategory = document.getElementById('blogCategory');
    const blogDate = document.getElementById('blogDate');
    const headerPlaceholder = document.getElementById('headerPlaceholder');
    const headerContent = document.getElementById('headerContent');

    if (blogTitle) blogTitle.innerText = blog.title;
    if (blogCategory) blogCategory.innerText = formatCategory(blog.category);
    if (blogDate) blogDate.innerText = formatDate(blog.publishedAt);

    // Transition header
    if (headerPlaceholder) headerPlaceholder.classList.add('hidden');
    if (headerContent) {
        headerContent.classList.remove('hidden');
        setTimeout(() => {
            headerContent.classList.remove('opacity-0');
        }, 100);
    }

    // Update featured image
    const featuredImageContainer = document.getElementById('featuredImageContainer');
    if (blog.image) {
        featuredImageContainer.innerHTML = `
            <div class="max-w-6xl mx-auto px-6">
                <div class="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 group">
                    <img src="${blog.image}"
                         alt="${blog.title}" 
                         class="w-full h-[400px] md:h-[700px] object-cover transition-transform duration-1000 group-hover:scale-105"
                         onerror="this.src='./assets/blogimg1.webp'"
                         data-aos="zoom-in">
                    <div class="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>
            </div>
        `;
    } else {
        featuredImageContainer.style.display = 'none';
    }

    // Update blog content
    const blogBody = document.getElementById('blogBody');
    blogBody.innerHTML = `
        ${blog.excerpt ? `<div class="text-xl md:text-2xl text-blue-950 font-bold mb-16 leading-relaxed border-l-4 border-accent pl-8 italic" data-aos="fade-up">${blog.excerpt}</div>` : ''}
        <div class="prose prose-lg md:prose-xl prose-gray max-w-none text-gray-700 leading-relaxed font-light" data-aos="fade-up" data-aos-delay="100">
            ${formatBlogContent(blog.content)}
        </div>
    `;

    // Update author info
    const tgAuthors = ['Shivam', 'Abhishek'];
    const fallbackAuthor = tgAuthors[Math.floor(Math.random() * tgAuthors.length)];
    const authorName = blog.author?.username || fallbackAuthor;
    const authorInfo = document.getElementById('authorInfo');
    authorInfo.innerHTML = `
        <div class="pt-24 border-t border-gray-100" data-aos="fade-up">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-12 bg-gray-50/50 p-8 md:p-12 rounded-3xl border border-gray-100">
                <div class="w-24 h-24 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-primary/20 flex-shrink-0">
                    ${authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <span class="text-[10px] tracking-[0.3em] font-black uppercase text-accent/60 mb-3 block">Written By</span>
                    <h4 class="text-3xl font-bold text-blue-950 mb-4">${authorName}</h4>
                    <p class="text-gray-500 leading-relaxed text-lg max-w-2xl font-light">
                        ${blog.author?.bio || 'Leading the digital transformation frontier at ThunderGits Technology. Expert in building scalable architectures and premium user experiences.'}
                    </p>
                    <div class="flex gap-4 mt-8">
                        <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent transition-all shadow-sm"><i class="ri-linkedin-fill"></i></a>
                        <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent transition-all shadow-sm"><i class="ri-twitter-fill"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Update tags
    const blogTags = document.getElementById('blogTags');
    if (blog.tags && blog.tags.length > 0) {
        blogTags.innerHTML = `
            <div class="flex flex-wrap gap-3" data-aos="fade-up">
                ${blog.tags.map(tag => `
                    <span class="px-5 py-2 bg-gray-100/50 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all cursor-pointer rounded-lg border border-gray-100 hover:border-accent shadow-sm">
                        #${tag}
                    </span>
                `).join('')}
            </div>
        `;
    } else {
        blogTags.style.display = 'none';
    }

    // Initialize progress bar
    initProgressBar();
}

// Progress Bar Logic
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";
    });
}

// Format blog content (convert line breaks to paragraphs)
function formatBlogContent(content) {
    if (!content) return '';
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map(paragraph => {
        const formattedParagraph = paragraph.replace(/\n/g, '<br>');
        return `<p class="mb-8">${formattedParagraph}</p>`;
    }).join('');
}

// Fetch and display related blogs
async function fetchRelatedBlogs(category, currentBlogId) {
    try {
        const response = await fetch(`https://api.thundergits.com/api/blogs/published?limit=20&sortBy=publishedAt&sortOrder=desc`);
        const data = await response.json();
        
        if (data.success && data.data) {
            const allBlogs = data.data.filter(blog => blog._id !== currentBlogId);
            displayRelatedBlogs(allBlogs);
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
        document.getElementById('relatedBlogs').style.display = 'none';
    }
}

// Display related blogs
function displayRelatedBlogs(blogs) {
    const container = document.getElementById('relatedBlogsContainer');
    if (!container) return;
    
    if (blogs.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="ri-article-line text-gray-200 text-6xl mb-4"></i>
                <p class="text-gray-400 text-lg">No related articles found</p>
            </div>
        `;
        return;
    }
    
    let visibleCount = 6;
    
    function renderBlogs() {
        const blogsToShow = blogs.slice(0, visibleCount);
        
        container.innerHTML = `
            ${blogsToShow.map((blog, index) => `
                <div class="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200/50 hover:border-accent/50 hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
                    <div class="h-56 overflow-hidden relative">
                        <img src="${blog.featuredImage || blog.image || './assets/blogimg1.webp'}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${blog.title}" onerror="this.src='./assets/blogimg1.webp'">
                        <div class="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors duration-700"></div>
                    </div>
                    <div class="p-8 flex flex-col flex-grow">
                        <div class="flex items-center gap-3 mb-5">
                            <span class="text-[10px] font-black uppercase tracking-widest text-accent px-2 py-1 bg-accent/5 rounded">${formatCategory(blog.category)}</span>
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">5 min read</span>
                        </div>
                        <h3 class="text-xl font-bold text-blue-950 mb-4 group-hover:text-accent transition-colors leading-tight">${blog.title}</h3>
                        <p class="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed">${blog.excerpt || 'Read more about this topic.'}</p>
                        <div class="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">${new Date(blog.publishedAt).toLocaleDateString()}</span>
                            <a href="./blogdetails.html?id=${blog._id}" class="w-10 h-10 rounded-full bg-blue-950 text-white flex items-center justify-center hover:bg-accent transition-colors shadow-lg group-hover:scale-110">
                                <i class="fas fa-arrow-right text-xs"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `).join('')}
            
            ${blogs.length > visibleCount ? `
                <div class="col-span-full text-center mt-12">
                    <button id="showMoreBlogs" class="px-10 py-4 bg-blue-950 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent transition-all shadow-lg">
                        Load More Articles
                    </button>
                </div>
            ` : ''}
        `;
        
        const showMoreBtn = document.getElementById('showMoreBlogs');
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => {
                visibleCount = Math.min(visibleCount + 6, blogs.length);
                renderBlogs();
                setTimeout(() => {
                    showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            });
        }
    }
    renderBlogs();
}

// Show error message
function showError(message) {
    const blogBody = document.getElementById('blogBody');
    const featuredImageContainer = document.getElementById('featuredImageContainer');
    const headerPlaceholder = document.getElementById('headerPlaceholder');
    
    if (headerPlaceholder) headerPlaceholder.innerHTML = `
        <div class="max-w-4xl mx-auto px-6 text-center py-10">
            <i class="ri-error-warning-line text-red-500 text-6xl mb-6"></i>
            <h2 class="text-2xl font-bold text-white mb-4">Article Not Found</h2>
            <p class="text-gray-400 mb-8">${message}</p>
            <a href="./blog.html" class="inline-flex items-center bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent/50 hover:text-white transition-all">
                <i class="ri-arrow-left-line mr-3"></i> Back to Blog
            </a>
        </div>
    `;
    
    if (featuredImageContainer) featuredImageContainer.style.display = 'none';
    if (blogBody) blogBody.style.display = 'none';
    document.getElementById('relatedBlogs').style.display = 'none';
}

// Hide loading spinner
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.transition = 'opacity 0.5s';
        spinner.style.opacity = '0';
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 500);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initHeroGrid();
    fetchBlogDetails();
});