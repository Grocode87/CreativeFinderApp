import { ViewChild, Component } from '@angular/core';
import { IonicPage, Content, Searchbar, NavController, NavParams, Nav, Events } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
import { GoogleAnalytics } from '@ionic-native/google-analytics/';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the SearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search-results',
  templateUrl: 'search-results.html',
})
export class SearchResultsPage {
    query: any = "Val"
    searchTerm: any;
    maps: any;
    creators: any;
    categories: any;
    showResults; any;

    @ViewChild(Content) content: Content;
    @ViewChild('searchbar') searchbar:Searchbar;

    errorLoading = false;
    
    suggestions = []
    history = []
    toggled: any = false;
    showX: any = true;
  

  constructor(public storage: Storage, public ga: GoogleAnalytics, public navCtrl: NavController, public navParams: NavParams, public nav: Nav, public serverProvider: ServerProvider, public events: Events) {
    this.query = navParams.get('query')
    this.query = this.query.toLowerCase()
    this.ga.trackEvent('Search', "Query", this.query);

    this.searchTerm = this.query;

     storage.get('recent_searches').then((val) => {
            if(val) {
                let searches = JSON.parse(val).searches
                if(searches.indexOf(this.query) > -1) {
                    searches.splice(searches.indexOf(this.query), 1);
                }

                searches.unshift(this.query)
                if(searches.length > 4){
                    searches.length = 4
                }

                this.storage.set('recent_searches', JSON.stringify({"searches":searches}));
            }
        });
  }

   ionViewDidLoad() {
        this.ga.trackView('Search Results');
        this.search()
        
    }

    search() {
        this.serverProvider.getSearch(this.query)
        .then(data => {
          this.maps = data['results'];
          this.creators = data['creators'];
          this.categories = data['categories'];
        }).catch(error => { 
            this.errorLoading = true;
        });
    }

    
    tryAgain() {
        this.errorLoading = false;
        this.search()
    }

    viewCategory(category) {
        this.ga.trackEvent('Category', "Search", category);
        this.events.publish('view:category', category);
        this.navCtrl.pop()
    }

    viewCreator(creator) {
        this.ga.trackEvent('Creator', "Search", creator.name);

        this.navCtrl.push('CreatorDetailsPage', {
            'creator':  creator
        })
    }

    onFocus() {
        this.showX = false;
    }
    onBlur() {
        this.showX = true;
    }
    clearPressed() {
        this.searchTerm = ""
        this.toggleSearch();
        this.searchUpdated(null);
    }

    toggleSearch() {
        this.toggled = this.toggled ? false : true;
        if(this.toggled) {
            this.searchUpdated(null)
            setTimeout(() => {
                this.searchbar.setFocus();
                }, 400);
        }
    }

    searchQuery() {
      const val = this.searchTerm;
    
      if (val && val.trim() != '') {
        this.navCtrl.push('SearchResultsPage', {
            query: val
        }).then(() =>{
          this.searchTerm = ""
          this.toggled = false

          let index = this.navCtrl.length()-2;
          this.navCtrl.remove(index); 
        })
      }
    }

    searchUpdated(ev: any) {
        this.toggled = true;
        if(!ev) {
            this.getHistory()
        } else {
            let val = ev.target.value;

            if (!val || val.trim() == '') {
                this.getHistory()
            } else {
                this.getSuggestions(val)
            }
        }
    }

    getHistory() {
        this.storage.get('recent_searches').then((val) => {
            this.suggestions = []
            this.history = JSON.parse(val).searches
            console.log(this.history)
        });
    }
    getSuggestions(query) {
        this.serverProvider.getAutocomplete(query).then(data => {
             this.suggestions = data['results']
             this.history = []
        }).catch(error => { return []});
    }
    suggestionClicked(suggestion) {
        this.searchTerm = suggestion

        this.searchQuery()
    }
}
