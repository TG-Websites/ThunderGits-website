
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applicationForm');
  const submitBtn = document.getElementById('submitButton');
  const buttonText = document.getElementById('buttonText');
  const loader = document.getElementById('loader');
  const thankYouMessage = document.getElementById('thankYouMessage');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    buttonText.textContent = "Submitting...";
    loader.classList.remove('hidden');

    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const jobTitle = form.jobTitle.value;
    // ❌ resume ignored (not sent to backend)

    const emailHtml = `
      <h2>New Job Application</h2>
      <p><strong>Position:</strong> ${jobTitle}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><em>Resume uploaded on site but not sent via email service.</em></p>
    `;

    try {
      const response = await fetch('https://tg-email-service.thundergits.com/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteKey: 'thundergits',
          to: 'abhishek@thundergits.com', // 🔹 replace with your inbox
          subject: `Job Application - ${jobTitle} (${name})`,
          html: emailHtml,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        thankYouMessage.classList.remove("hidden");
        form.reset();
      } else {
        alert("❌ Failed to submit application: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to submit application. Please try again later.");
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      buttonText.textContent = "Submit Application";
      loader.classList.add("hidden");
    }
  });
});

