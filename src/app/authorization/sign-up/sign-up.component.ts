import { Component, EventEmitter, Output } from '@angular/core';
import { SignUpService } from '../services/sign-up.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SignUpEmailErrorStateMatcher } from '../helpers/error-state-matcher/sign-up-email-error-state-matcher';
import { emailRegEx } from '../helpers/regex/email.regex';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'bal-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  emailSent = false;
  sendingEmail = false;
  emailForm: FormGroup;
  matcher = new SignUpEmailErrorStateMatcher();

  @Output() signUp = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private signUpService: SignUpService
  ) {
  }

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(emailRegEx),
      ]]
    });
  }

  async sendEmailLink() {
    this.sendingEmail = true;
    this.signUpService.signUp(this.userEmail)
      .pipe(catchError(this.onEmailError))
      .subscribe(() => this.onEmailSuccess());
  }

  private onEmailSuccess = () => {
    this.signUp.emit(this.userEmail);
    this.emailSent = true;
    this.sendingEmail = false;
  }

  private onEmailError = (err: any) => {
    this.toastr.error(err.message, 'Error');
    return of(err.message);
  }

  get email(): AbstractControl {
    return this.emailForm.get('email')!;
  }

  get userEmail(): string {
    return this.email?.value;
  }
}
