import { CommonModule } from '@angular/common';
import { Component , OnInit } from '@angular/core';
import { FormBuilder , FormGroup , FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface contactForm {
  name: string;
  email: string;
  phone: string;
  title: string;
  message: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  standalone : true
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitted = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  isSubmitting = false;

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
  });

}
  ngOnInit() {}

  onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitForm(this.contactForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }
  
  private submitForm(formData: contactForm) {
    const googleform = 'https://docs.google.com/forms/d/e/1FAIpQLSd3Ov-G5GIaU_gxohd1XZAbfcMolmomUhzgKxvGMP53s6qCDw/formResponse';
    const formDataToSend = new URLSearchParams();
    formDataToSend.append('entry.1822134070', formData.name);
    formDataToSend.append('entry.836708183', formData.email);
    formDataToSend.append('entry.1739681311', formData.phone);
    formDataToSend.append('entry.978430069', formData.title);
    formDataToSend.append('entry.184655333', formData.message);

    fetch(googleform, {
      method: 'POST',
      body: formDataToSend,
      mode: 'no-cors',
    }).then(() => {
              this.showSuccessMessage = true;
        this.contactForm.reset();
      }).catch(() => {
              this.showErrorMessage = true;
      }).finally(() => {
              this.isSubmitting = false;
      });
}
private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach((key) => {
      this.contactForm.controls[key]?.markAsTouched();
    });
}
closeSuccessMessage() {
    this.showSuccessMessage = false;
}
closeErrorMessage() {
    this.showErrorMessage = false;
}
getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }

    return '';
  }
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get phone() { return this.contactForm.get('phone'); }
  get title() { return this.contactForm.get('title'); }
  get message() { return this.contactForm.get('message'); }
  
}

