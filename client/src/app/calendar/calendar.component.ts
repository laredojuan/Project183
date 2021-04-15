import { Component, OnInit } from "@angular/core";
import { config } from "./config";
import { LocalStorageService } from "../localStorageService";
import { Iuser } from "../login/login.component";
import { Router } from "@angular/router";

interface IMonths {
  id: number;
  name: string;
}

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  private currentMonth: string;
  private currentDate: string;
  private currentYear: string;

  public displayString: string = "";
  public coverImage: string = "";
  public homeContent: string = config.home;
  public isLoading: boolean = false;
  localStorageService: LocalStorageService<Iuser>;
  currentUser: Iuser = null;

  dates: Array<number> = [];

  Months: IMonths[] = [
    {
      id: 1,
      name: "January",
    },
    {
      id: 2,
      name: "February",
    },
    {
      id: 3,
      name: "March",
    },
    {
      id: 4,
      name: "April",
    },
    {
      id: 5,
      name: "May",
    },
    {
      id: 6,
      name: "June",
    },
    {
      id: 7,
      name: "July",
    },
    {
      id: 8,
      name: "August",
    },
    {
      id: 9,
      name: "September",
    },
    {
      id: 10,
      name: "October",
    },
    {
      id: 11,
      name: "November",
    },
    {
      id: 12,
      name: "December",
    },
  ];

  arrayThree(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map((i) => i + startFrom).sort((a, b) => b - a);
  }

  constructor(private router: Router) {
    this.dates = Array.from({ length: 31 }, (v, k) => k + 1);
    this.localStorageService = new LocalStorageService("user");
  }

  ngOnInit(): void {
    this.currentUser = this.localStorageService.getItemsFromLocalStorage(
      "user"
    );
    if (this.currentUser === null) {
      this.router.navigate(["login"]);
    } else {
      fetch(config.baseURL)
        .then((res) => res.json())
        .then((json) => {
          this.homeContent = `<div class="grid grid-4" style="max-width: 75%">`;
          json.map((j) => {
            this.homeContent += `<a
        target="_blank"
        href="${j.url}"
        class="block"
      >
        <img
          alt="${j.url.split("/").pop()}"
          src="../../assets/images/${j.url.split("/").pop()}.svg"
        />
        <h4><span>${j.chineseText}</span> ${j.name}</h4>
        <p class="medium">${j.year}</p></a
      >`;
          });
          this.homeContent += `</div>`;
        });
    }
  }

  fetchDetails() {
    this.displayString = "";
    this.coverImage = "";
    const date = new Date(
      Number(this.currentYear),
      Number(+this.currentMonth) - 1,
      Number(this.currentDate)
    );

    const isValidDate =
      Boolean(+date) && date.getDate() === Number(this.currentDate);
    if (!isValidDate) {
      alert("Please select valid date");
      return;
    }
    this.isLoading = true;
    fetch(`${config.baseURL}/search`, {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        date: Number(this.currentDate),
        month: Number(this.currentMonth),
        year: Number(this.currentYear),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        this.displayString = json.description;
        this.coverImage = `../../assets/images/${json.url
          .split("/")
          .pop()}.svg`;
        this.isLoading = false;
      })
      .catch((e) => console.log(e));
  }

  changeMonth(value) {
    this.currentMonth = value;
  }

  changeDate(value) {
    this.currentDate = value;
  }

  changeYear(value) {
    this.currentYear = value;
  }

  logout() {
    this.localStorageService.clearItemFromLocalStorage("user");
    this.router.navigate(["login"]);
  }
}
