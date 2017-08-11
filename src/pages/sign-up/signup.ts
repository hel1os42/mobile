import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { LoginPage } from "../login/login";
import { RegisterPage } from "../register/register";
import { InvitePage } from "../invite/invite";
import { SignUpPage } from "../signup/signup";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
