import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/shared/services/helper.service';
import { HttpService } from 'src/app/shared/services/http.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public show: boolean = false;
  public errorMessage: any;
  public loginForm: any = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    // role: ['admin ', Validators.required],

  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService,
    private helper: HelperService
  ) {
  }

  ngOnInit() { }

  showPassword() {
    this.show = !this.show;
  }
  login() {
    this.http.post('/admin-login', this.loginForm.value, false).subscribe((res: any) => {
      console.log(res, "helloresss");
      localStorage.setItem('token', JSON.stringify(res?.access_token))
      localStorage.setItem('role', res?.user?.role)
      this.helper.token.next(res?.access_token)
      localStorage.setItem('user_id', JSON.stringify(res?.user?.id))
      this.router.navigate(['/dashboard/home'])
    })
  }
}
