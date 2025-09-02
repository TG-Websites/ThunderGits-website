// index.js

// contact us
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

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
        const res = await fetch("http://localhost:5000/api/jobs?role=superadmin");
        const data = await res.json();

        console.log("Raw API response:", data);

        const container = document.getElementById("jobsContainer");
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





