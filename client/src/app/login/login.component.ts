import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "../localStorageService";
import { config } from "../calendar/config";
import { animate } from "@angular/animations";

export interface Iuser {
  id?: number;
  username: string;
  password: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isError: boolean = false;
  error: string = "";
  user: Iuser = { username: "", password: "" };
  localStorageService: LocalStorageService<Iuser>;
  currentUser: Iuser = null;
  constructor(private router: Router) {
    this.localStorageService = new LocalStorageService("user");
  }

  ngOnInit(): void {
    this.currentUser = this.localStorageService.getItemsFromLocalStorage(
      "user"
    );
    console.log(this.currentUser);
    if (this.currentUser !== null) {
      this.router.navigate(["calendar"]);
    }
  }

  login(user: Iuser) {
    console.log("from login user: ", user);
    // const defaultUser: Iuser = { username: "Juan", password: "Laredo123" };
    if (user.username !== "" && user.password !== "") {
      fetch(config.baseURL + "/login", {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (!json.status) {
            this.isError = true;
            this.error = "Username or Password is incorrect";
          } else {
            this.isError = false;
            this.localStorageService.saveItemsToLocalStorage(user);
            this.router.navigate(["calendar"]);
          }
        });
    } else {
      this.isError = true;
      this.error = "Please enter valid username or password";
    }
  }
}
