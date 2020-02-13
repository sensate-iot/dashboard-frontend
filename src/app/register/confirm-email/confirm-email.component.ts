import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {AccountService} from '../../services/account.service';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {

  private params: Subscription;
  private userId: string;
  private token: string;

  public constructor(private route: ActivatedRoute, private router: Router,
                     private accounts: AccountService, private notifs: AlertService) {
    this.params = this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.token = params['token'];
    });
  }

  public forward() {
    this.router.navigate(['/login']);
  }

  public ngOnInit() {
    if(this.userId.length <= 0 || this.token.length <= 0) {
      return;
    }

    this.accounts.confirmRegistration(this.userId, this.token).subscribe(() => {
      this.notifs.showSuccessNotification("Account confirmed!");
      this.forward();
    }, () => {
      this.notifs.showErrorNotification("Invalid confirmation URL!");
      this.forward();
    });
  }

  public ngOnDestroy(): void {
    this.params.unsubscribe();
  }
}
