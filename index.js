// index.js

// contact us
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    
    if (!form) return; // Exit if form doesn't exist on this page

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            message: form.message.value,
        };

        try {
            const res = await fetch("http://localhost:5000/api/contact/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Message sent successfully!");
                form.reset();
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    });
});


// apply job appilaction

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("applicationForm");
    
    if (!form) return; // Exit if form doesn't exist on this page

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name.value);
        formData.append("email", form.email.value);
        formData.append("phone", form.phone.value);
        formData.append("resume", form.resume.files[0]); // ✅ real file

        try {
            const res = await fetch("http://localhost:5000/api/applications", {
                method: "POST",
                body: formData, // ✅ no headers, browser sets automatically
            });

            const data = await res.json();
            if (res.ok) {
                alert("Application submitted successfully!");
                form.reset();
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    });
});


// fetch all jobs

async function fetchJobs() {
    try {
        const container = document.getElementById("jobsContainer");
        if (!container) return; // Exit if container doesn't exist on this page
        
        const res = await fetch("http://localhost:5000/api/jobs?role=superadmin");
        const data = await res.json();

        console.log("Raw API response:", data);

        container.innerHTML = "";

        // If your API wraps jobs inside an object, adjust here
        const jobs = Array.isArray(data) ? data : data.data;
        console.log("Jobs to render:", jobs);

        if (!Array.isArray(jobs)) {
            throw new Error("API did not return an array of jobs");
        }

        jobs.forEach((job) => {
            console.log("Rendering job:", job.jobTitle);

            const card = `
        <div class="group border-l-4 border-accent p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white flex flex-col"
            data-aos="fade-up">
            <div class="flex items-center mb-3">
                <i class="fas fa-briefcase text-accent text-lg mr-2"></i>
                <h3 class="text-lg font-semibold text-dark line-clamp-1">
                    ${job.jobTitle}
                </h3>
            </div>
            <div class="text-gray-600 text-sm mb-6 line-clamp-4 ">
                ${job.jobDescription}
            </div>
           <div class="mt-auto flex justify-center">
            <a href="./jobs/jobDetail.html?id=${job._id}" 
              class="inline-block px-4 py-1.5 text-xs font-medium border border-accent text-accent 
              hover:bg-accent hover:text-white transition duration-300">
             Apply Now
            </a>
        </div>

        </div>
      `;

            const wrapper = document.createElement("div");
            wrapper.innerHTML = card;
            container.appendChild(wrapper.firstElementChild);
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchJobs);


// Fetch and display latest blogs
async function fetchLatestBlogs() {
    try {
        const container = document.getElementById("blogContainer");
        if (!container) return; // Exit if container doesn't exist on this page
        
        const res = await fetch("http://localhost:5000/api/blogs/published?limit=3&sortBy=publishedAt&sortOrder=desc");
        const data = await res.json();

        console.log("Blog API response:", data);

        container.innerHTML = "";

        const blogs = data.data || [];

        if (blogs.length === 0) {
            // Show placeholder if no blogs
            container.innerHTML = `
                <div class="swiper-slide p-2">
                    <div class="flex flex-col h-[580px] bg-white border border-pink-200 rounded-xl shadow-sm items-center justify-center">
                        <i class="fas fa-blog text-gray-400 text-6xl mb-4"></i>
                        <p class="text-gray-500 text-lg">No blogs available yet</p>
                        <p class="text-gray-400 text-sm">Check back soon for exciting content!</p>
                    </div>
                </div>
            `;
            return;
        }

        blogs.forEach((blog) => {
            const publishedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Truncate excerpt if too long
            const excerpt = blog.excerpt && blog.excerpt.length > 120 
                ? blog.excerpt.substring(0, 120) + '...' 
                : blog.excerpt || 'No description available';

            // Format category for display
            const categoryDisplay = blog.category 
                ? blog.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                : 'General';

            const card = `
                <div class="swiper-slide p-2">
                    <div class="flex flex-col h-[auto] bg-white border border-pink-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <img src="${blog.featuredImage || './assets/default-blog.webp'}" 
                             alt="${blog.title}" 
                             class="w-full h-56 object-cover"
                             onerror="this.src='./assets/default-blog.webp'">
                        <div class="flex flex-col flex-1 p-6">
                            <p class="text-xs uppercase text-pink-600 font-semibold mb-2">${categoryDisplay}</p>
                            <h3 class="font-bold text-lg text-black mb-2 line-clamp-2">${blog.title}</h3>
                            <p class="text-gray-500 text-sm mb-4 flex-1 line-clamp-4">
                                ${excerpt}
                            </p>
                            <div class="text-xs text-gray-400 mb-3">
                                <i class="fas fa-calendar-alt mr-1"></i>
                                ${publishedDate}
                                ${blog.readTime ? `<span class="ml-3"><i class="fas fa-clock mr-1"></i>${blog.readTime} min read</span>` : ''}
                            </div>
                            <div class="mt-auto">
                                <a class="inline-flex items-center text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-2 rounded-md shadow hover:opacity-90 transition-all duration-300"
                                   href="./blogdetails.html?id=${blog._id}">
                                    Learn More
                                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const wrapper = document.createElement("div");
            wrapper.innerHTML = card;
            container.appendChild(wrapper.firstElementChild);
        });

        // Reinitialize Swiper after adding content
        if (window.blogSwiper) {
            window.blogSwiper.update();
        }

    } catch (error) {
        console.error("Error fetching blogs:", error);
        const container = document.getElementById("blogContainer");
        container.innerHTML = `
            <div class="swiper-slide p-2">
                <div class="flex flex-col h-[580px] bg-white border border-pink-200 rounded-xl shadow-sm items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-red-400 text-6xl mb-4"></i>
                    <p class="text-red-500 text-lg">Failed to load blogs</p>
                    <p class="text-gray-400 text-sm">Please try again later</p>
                </div>
            </div>
        `;
    }
}

// Load blogs when page loads
document.addEventListener("DOMContentLoaded", fetchLatestBlogs);





