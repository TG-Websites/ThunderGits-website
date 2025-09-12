
  document.getElementById('feedback-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Disable button + show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-5 w-5 mr-2 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"></path>
      </svg>
      Sending...
    `;

    const leadName = form.name.value;
    const leadEmail = form.email.value;
    const leadPhone = form.phone.value;
    const leadSubject = form.subject.value || 'New Website Enquiry';
    const notes = form.message.value;

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${leadName}</p>
      <p><strong>Email:</strong> ${leadEmail}</p>
      <p><strong>Phone:</strong> ${leadPhone}</p>
      <p><strong>Subject:</strong> ${leadSubject}</p>
      <p><strong>Message:</strong></p>
      <p>${notes}</p>
    `;

    try {
      const response = await fetch('https://tg-email-service.thundergits.com/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteKey: 'thundergits',
          to: 'abhishek@thundergits.com',
          subject: `New Enquiry from ${leadName}`,
          html: emailHtml,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const modal = document.getElementById('successModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        form.reset();

        const closeModal = document.getElementById('closeModal');
        closeModal.addEventListener('click', () => {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        });
      } else {
        alert('❌ Failed to send message: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to send message. Please try again later.');
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Get in touch";
    }
  });

