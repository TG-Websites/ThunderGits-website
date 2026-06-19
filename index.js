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
            const res = await fetch("https://api.thundergits.com/api/contact/create", {
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
            const res = await fetch("https://api.thundergits.com/api/applications", {
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

        const res = await fetch("https://api.thundergits.com/api/jobs?role=superadmin");
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
        <div class="group bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 flex flex-col" data-aos="fade-up" data-aos-delay="100">
          <div class="flex items-center gap-4 ">
            <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <i class="ri-palette-line text-2xl text-indigo-400 group-hover:text-white transition-colors"></i>
            </div>
            <h3 class="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors"> ${job.jobTitle}</h3>
          </div>
          <p class="text-gray-400 leading-relaxed mb-8 flex-grow">${job.jobDescription} </p>
          <a href="./jobs/jobDetail.html?id=${job._id}"  class="inline-flex items-center gap-2 mt-10 text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
            Apply Now <i class="ri-arrow-right-line"></i>
          </a>
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
// Fetch and display latest blogs
async function fetchLatestBlogs() {
    try {
        const container = document.getElementById("blogContainer");
        if (!container) return;

        const res = await fetch("https://api.thundergits.com/api/blog");
        const data = await res.json();

        console.log("Blog API response:", data);

        container.innerHTML = ""; // clear old content

        const blogs = data.data || [];

        if (blogs.length === 0) {
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
            const excerpt = blog.excerpt && blog.excerpt.length > 120
                ? blog.excerpt.substring(0, 120) + '...'
                : blog.excerpt || 'No description available';

            const categoryDisplay = blog.category
                ? blog.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                : 'General';

            // Card markup (same style as demo card)
            const cardHTML = `
                <div class="swiper-slide p-2">
                    <div class="flex flex-col h-[580px] bg-white border border-pink-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
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

            // Append directly without wrapper issue
            container.insertAdjacentHTML("beforeend", cardHTML);
        });

        // ✅ Reinitialize Swiper properly
        if (window.blogSwiper) {
            window.blogSwiper.update();
        } else {
            window.blogSwiper = new Swiper(".blogSwiper", {
                slidesPerView: 1,
                spaceBetween: 20,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                breakpoints: {
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }
            });
        }

    } catch (error) {
        console.error("Error fetching blogs:", error);
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

const slider = document.getElementById("carousel");

if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("active");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();

        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    /* Mobile touch support */
    slider.addEventListener("touchstart", (e) => {
        startX = e.touches[0].pageX;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("touchmove", (e) => {
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}



