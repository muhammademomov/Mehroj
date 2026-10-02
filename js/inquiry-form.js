// ============================================
// INQUIRY FORM — shared by the homepage and pages/inquiry.html
// Sends the form to the API; shows "Thank you" only after the server confirms.
// ============================================

(function(){
  const INQUIRY_URL = 'https://mehroj-production.up.railway.app/api/inquiry';

  function showError(container, html){
    let box = document.getElementById('form-error');
    if(!box){
      box = document.createElement('div');
      box.id = 'form-error';
      box.style.cssText = 'margin-top:14px;padding:14px;border-radius:10px;background:#FBEAE8;color:#C0392B;font-size:14.5px;line-height:1.5;text-align:center';
      container.appendChild(box);
    }
    box.innerHTML = html;
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideError(){
    const box = document.getElementById('form-error');
    if(box) box.style.display = 'none';
  }

  window.submitForm = async function(e){
    if(e) e.preventDefault();
    const container = document.getElementById('form-container');
    const btn = e && e.target ? e.target.closest('button') : container.querySelector('button');
    if(btn && btn.disabled) return; // already sending
    const btnText = btn ? btn.textContent : '';

    // Collect fields: every .form-group label -> its field value
    const formData = {};
    let firstInvalid = null;
    container.querySelectorAll('.form-group').forEach(group => {
      const label = group.querySelector('label');
      const field = group.querySelector('input[type=text], input[type=email], input[type=tel], input[type=date], select, textarea');
      if(!label || !field) return;
      const value = field.value.trim();
      const required = field.hasAttribute('required');
      const invalid = (required && !value) ||
        (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
      field.style.borderColor = invalid ? '#C0392B' : '';
      if(invalid && !firstInvalid) firstInvalid = field;
      if(value) formData[label.textContent.replace('*','').trim()] = value;
    });
    if(firstInvalid){
      showError(container, 'Please fill in your <b>first name</b>, <b>last name</b> and a valid <b>email</b>.');
      firstInvalid.focus();
      return;
    }
    hideError();

    const radio = container.querySelector('input[name="location_type"]:checked');
    if(radio) formData['Indoor or Outdoor'] = radio.value;
    const checked = [...container.querySelectorAll('#services-checkboxes input:checked')].map(c => c.value);
    if(checked.length) formData['Rental Items'] = checked.join(', ');
    formData.submittedAt = new Date().toLocaleString();

    if(btn){ btn.disabled = true; btn.textContent = 'Sending...'; }
    try {
      const res = await fetch(INQUIRY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(!res.ok) throw new Error('Server error ' + res.status);
      // Success - only now show the thank-you screen
      container.style.display = 'none';
      const success = document.getElementById('form-success');
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch(err) {
      console.log('Inquiry error:', err);
      if(btn){ btn.disabled = false; btn.textContent = btnText; }
      showError(container, '⚠️ Something went wrong and your inquiry was NOT sent.<br>Please try again in a minute, or call/text us directly at <b>571-786-1516</b>.');
    }
  };
})();
