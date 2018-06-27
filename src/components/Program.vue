<template>
    <div class="program">
        <display-modal :modalCredit="modalCredit" :modal-open="modalOpen" @modalClose="toggleModal" />
        <div class="presenter">
            <h3>Presented by {{program.organization.name}}</h3>
        </div>
        <div class="title" >
            <h1>{{program.title}}</h1>
            <h4>{{program.subtitle}}</h4>
        </div>
        <div class="featured-creative flex" >
            <credit v-for="(credit, key) in featuredCreatives" :key="key" :credit="credit" :type="'credited_role'" @creditClick="handleCreditClick" />
        </div>
        <div class="regular-creative flex" >
            <credit v-for="(credit, key) in regularCreatives" :key="key" :credit="credit" :type="'credited_role'" @creditClick="handleCreditClick" />
        </div>
        <div class="cast" >
            <h2 class="cast-title" ><span class="text line" >Featuring</span></h2>
            <div class="featured-cast-container flex">
                <credit v-for="(credit, key) in featuredCast" :key="key" :credit="credit" :type="'role'" @creditClick="handleCreditClick" />
            </div>
            <div class="regular-cast-container flex" >
                <credit v-for="(credit, key) in regularCast" :key="key" :credit="credit" :type="'role'" @creditClick="handleCreditClick" />
            </div>
        </div>
        <div class="organization" >
            <h2 class="line" >About {{program.organization.name}}</h2>
            <p class="org-about" >
                {{program.organization.about}}
            </p>
            <div class="org-staff" >
                <h4>Staff</h4>
                <div class="org-staff-container flex" >
                    <credit v-for="(credit, key) in program.organization.staff" :key="key" :credit="credit" :type="'role'" />
                </div>
            </div>
            <div class="funders">
                <div class="institutional" >
                    <h4>{{program.organization.funders.title_text}} </h4>
                    <ul class="inst-fund-container" >
                        <li v-for="(funder, key) in displayInstFunders" :key="key" >
                            {{funder.name}} - <span class="donated-amount" >{{parseDonation(funder.amount_donated)}}</span>
                        </li>
                    </ul>
                    <ul class="ind-fund-container" >
                        <li v-for="(funder, key) in displayIndFunders" :key="key" >
                            {{funder.name}} - <span class="donated-amount" >{{parseDonation(funder.amount_donated)}}</span>
                        </li>
                    </ul>

                </div>
                <div class="individual" >

                </div>
            </div>
        </div>
    </div>    
</template>

<script>
import jsonImport from '../assets/program.json'
import Credit from './Credit'
import DisplayModal from './Modal'

export default {
    components: {
        Credit, DisplayModal
    },
    data: function() {
        return {
            program: {},
            modalCredit: {
                name: "Jason Tseng",
                role: "Book",
                credited_role: "book by",
                featured: true,
                bio: "sed elementum tempus egestas sed sed risus pretium quam vulputate dignissim suspendisse in est ante in nibh mauris cursus mattis molestie a iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere",
                image: "https://static1.squarespace.com/static/574549d97da24fdfe9e2eba2/t/5745fd94b6aa6046fe0ca9bf/1464204694145/jason+headshot.png?format=500w",
                link: "https://www.jasontseng.com"
            },
            modalOpen: false
        }
    },
    created: function() {
        this.program = jsonImport;
    },
    computed: {
        featuredCreatives: function() {
            return this.program.credits.creative.filter(credit => {
                return credit.featured === true;
            })
        },
        regularCreatives: function() {
            return this.program.credits.creative.filter(credit => {
                return credit.featured === false;
            })
        },
        featuredCast: function() {
            return this.program.credits.cast.filter(credit => {
                return credit.featured === true;
            })
        },
        regularCast: function() {
            return this.program.credits.cast.filter(credit => {
                return credit.featured === false;
            })
        },
        displayInstFunders: function() {
            return this.program.organization.funders.institutional.sort((a, b) => {
                if (a.amount_donated < b.amount_donated) {
                    return -1;
                }
                if (a.amount_donated > b.amount_donated) {
                    return 1;
                }
                return 0;
            })
        },
        displayIndFunders: function() {
            return this.program.organization.funders.individual.sort((a, b) => {
                if (a.amount_donated < b.amount_donated) {
                    return -1;
                }
                if (a.amount_donated > b.amount_donated) {
                    return 1;
                }
                return 0;
            })
        }   
    },
    methods: {
            parseDonation: function(num) {
                return num.toLocaleString()
            },
            handleCreditClick: function(credit) {
                this.modalCredit = credit;
                console.log(this.modalCredit.name)
                this.toggleModal()
            },
            toggleModal: function() {
                this.modalOpen = !this.modalOpen
            }
        }
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';
    .program {
        .cast-title {
            margin-bottom: 5px;
        }
        .line {
            display:flex;
        }
        .line::before, .line::after {
            content: '';
            display: inline-block;
            height: 1px;
            background-color: $gray;
            width: calc(50% - 140px);
            align-self: center; 
            flex-grow: 1;
        }

        .line::before {
            margin: 0 16px 0 32px;
        }
        .line::after {
            margin: 0 32px 0 16px;
        }
        .featured-creative, .regular-creative, .featured-cast-container, .regular-cast-container {
            .credit {
                cursor: pointer;
            }
        }
                
        .title {
            h1 {
                margin-bottom: 0px;
            }
            h4 {
                margin-top: .5rem;
            }
        }
        .flex {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
        }

        .organization {
            .org-about {
                font-family: $body-font;
                color: $black;
                padding: 0 32px;
                font-size: 12px;
                text-align: justify;
            }

            .funders {
                ul {
                    padding: 0;
                }
                li {
                    list-style:none;
                    font-family: $body-font;
                    span.donated-amount {
                        &::before {
                            content: "$"
                        }
                    }
                }
            }
        }

        
    }

</style>
