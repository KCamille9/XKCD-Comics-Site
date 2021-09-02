Vue.component('star-rating', VueStarRating.default);
let app = new Vue({
    el: '#app',
    data: 
    {
        number: '',
        max: '',
        current: 
        {
            title: '',
            img: '',
            alt: ''
        },
        loading: true,
        addedName: '',
        addedComment: '',
        addedPostedTime: '',
        comments: {},
        ratings: {},
    },
    created()
    {
        this.xkcd();
    },
    methods:
    {
        xkcd()
        {
            let url = 'https://xkcd.now.sh/?comic=';
            if(this.number === '')
            {
                url += 'latest';
            }
            else
            {
                url += this.number;
            }
            axios.get(url)
            .then(response => {
                console.log(response.data);
                this.current = response.data;
                this.loading = false;
                this.number = response.data.num;
                return true;
            })
            .catch(error => {
                console.log(error);
                this.number = this.max;
            })
        },
        // Buttons
        previousComic()
        {
            this.number = this.current.num - 1; //it is num from the 'response.data.num' if you look up
            if(this.number < 1)
            {
                this.number = 1;
            }
        },
        nextComic()
        {
            this.number = this.current.num + 1;
            if(this.number > this.max)
            {
                this.number = this.max;
            }
        },
        getRandom(min, max)
        {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The max and min are inclusive
        },
        // This will choose a random integer between 1 and the maximum number supported by XKCD
        randomComic()
        {
            this.number = this.getRandom(1, this.max);
        },
        firstComic()
        {
            this.number = 1;
        },
        lastComic()
        {
            this.number = '';
        },
        //Comments functionality
        addComment()
        {
            // Check whether the object has a comment yet
            if(!(this.number in this.comments))
            {
                Vue.set(app.comments, this.number, new Array);
            }
            this.comments[this.number].push({
                author: this.addedName,
                text: this.addedComment,
                commentTime: moment().format("LLL"),
            });
            this.addedName = '';
            this.addedComment = '';
        },
        // Rating
        setRating(rating)
        {
            // Handle the rating
            // Check whether the object has a rating yet
            if(!(this.number in this.ratings))
            {
                Vue.set(this.ratings, this.number, {
                    sum: 0,
                    total: 0,
                });
            }
            this.ratings[this.number].sum += rating;
            this.ratings[this.number].total += 1;
        },
    },
    computed:
    {
        // To compute a the name of the current month, since it is only given to us in numeric form. 
        month()
        {
            var month = new Array;
            if(this.current.month === undefined)
            {
                return '';
            }
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            return month[this.current.month - 1];
        }
    },
    // we need to tell Vue to fetch the new comic whenever the number changes
    watch:
    {
        number(value, oldValue)
        {
            if(oldValue === '')
            {
                this.max = value;
            }
            else
            {
                this.xkcd();
            }
        },
    },

})

// app.component('star-rating', VueStarRating.default)
// app.mount('#app')