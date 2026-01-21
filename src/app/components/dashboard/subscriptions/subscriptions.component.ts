import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/shared/services/http.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-subscriptions",
  templateUrl: "./subscriptions.component.html",
  styleUrls: ["./subscriptions.component.scss"],
})
export class SubscriptionsComponent implements OnInit {
  public activeTab: string = "active_subscriptions";
  public subscriptionData: any = {
    active_subscriptions: [],
    expired_subscriptions: [],
    trial_users: [],
    registered_users: [],
  };
  public loading: boolean = false;
  public searchInput: string | null = null;
  public duePage: number = 1;

  constructor(private http: HttpService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getSubscriptions();
  }

  getSubscriptions() {
    this.loading = true;
    this.http.get("/subscriptions", true).subscribe({
      next: (res: any) => {
        this.subscriptionData = res.data || {
          active_subscriptions: [],
          expired_subscriptions: [],
          trial_users: [],
          registered_users: [],
        };
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.duePage = 1; // Reset pagination on tab switch
  }

  get currentList() {
    return this.subscriptionData[this.activeTab] || [];
  }

  public receiptDetails: any = {
    latest: [],
    oldest: [],
  };
  public activeModalTab: number = 1;

  viewDetails(item: any, content: any) {
    this.activeModalTab = 1;
    let subscriptionData = item.subscription_data;
    let receiptToSubmit = subscriptionData;

    if (typeof subscriptionData === "string") {
      try {
        const parsed = JSON.parse(subscriptionData);
        receiptToSubmit = parsed.transactionReceipt || parsed;
      } catch (e) {
        console.error("Error parsing subscription_data", e);
      }
    } else if (subscriptionData && subscriptionData.transactionReceipt) {
      receiptToSubmit = subscriptionData.transactionReceipt;
    }

    console.log(receiptToSubmit, "Transaction Receipt to submit");

    this.http
      .post("/transaction_receipt", { "receipt-data": receiptToSubmit }, true)
      .subscribe({
        next: (res: any) => {
          console.log("Transaction receipt response:", res);
          if (res && res.receipt && res.receipt.in_app) {
            const sortedInApp = res.receipt.in_app
              .slice()
              .sort((a: any, b: any) => {
                const dateB = this.parseDate(b.purchase_date).getTime();
                const dateA = this.parseDate(a.purchase_date).getTime();
                if (isNaN(dateB)) return 1;
                if (isNaN(dateA)) return -1;
                return dateB - dateA;
              });

            this.receiptDetails = {
              latest: sortedInApp.slice(0, 1),
              oldest: sortedInApp.slice(1),
            };

            console.log("ďdd", this.receiptDetails);
            this.modalService.open(content, {
              size: "lg",
              centered: true,
              animation: false,
            });
          } else {
            console.warn(
              "No in-app purchases found in the receipt response.",
              res
            );
          }
        },
        error: (err: any) =>
          console.error("Error fetching transaction receipt:", err),
      });
  }

  private parseDate(dateStr: any): Date {
    if (!dateStr) return new Date();

    // If it's a timestamp string like "1717274183000.0"
    if (typeof dateStr === "string" && /^\d+(\.\d+)?$/.test(dateStr)) {
      return new Date(parseFloat(dateStr));
    }

    // If it's a number
    if (typeof dateStr === "number") {
      return new Date(dateStr);
    }

    // Handle "YYYY-MM-DD HH:mm:ss" format by replacing space with T for ISO compatibility
    if (typeof dateStr === "string" && dateStr.indexOf(" ") > 0) {
      return new Date(dateStr.replace(" ", "T"));
    }
    return new Date(dateStr);
  }
}
