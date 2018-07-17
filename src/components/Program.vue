<template>
    <div class="program">
        <display-modal :modalCredit="modalCredit" :modal-open="modalOpen" @modalClose="toggleModal" />
        <div class="presenter">
            <h3>Presented by {{organization.name}}</h3>
        </div>
        <div class="art" >
            <img :src="prodImage" >
        </div>
        <div class="title" :class="{hide: program.hide_title}" >
            <h1>{{program.title}}</h1>
            <h4>{{program.subtitle}}</h4>
        </div>
        <div class="featured-creative flex" >
            <credit v-for="(credit, key) in featuredCreatives" :key="key" :credit="credit" :creditType="'creative'" :type="'credited_role'" :editing="false"  @creditClick="handleCreditClick" />
        </div>
        <div class="regular-creative flex" >
            <credit v-for="(credit, key) in regularCreatives" :key="key" :credit="credit" :creditType="'creative'" :type="'credited_role'" :editing="false" @creditClick="handleCreditClick" />
        </div>
        <div class="cast" >
            <h2 class="cast-title" ><span class="text line" >Featuring</span></h2>
            <div class="featured-cast-container flex">
                <credit v-for="(credit, key) in featuredCast" :key="key" :credit="credit" :creditType="'cast'" :type="'role'" :editing="false" @creditClick="handleCreditClick" />
            </div>
            <div class="regular-cast-container flex" >
                <credit v-for="(credit, key) in regularCast" :key="key" :credit="credit" :creditType="'cast'" :type="'role'" :editing="false" @creditClick="handleCreditClick" />
            </div>
        </div>
        <div class="organization" >
            <h2 class="line" >About {{organization.name}}</h2>
            <img class="org-image" :src="organization.image" alt="">
            <p class="org-about" >
                {{organization.about}}
            </p>
            <div class="org-staff" >
                <h4>Staff</h4>
                <div class="org-staff-container flex" >
                    <credit v-for="(credit, key) in staff" :key="key" :credit="credit" :creditType="'staff'" :editing="false" :type="'role'" />
                </div>
            </div>
            <div class="funders">
                <div class="institutional" >
                    <h4>{{organization.funders.title_text}} </h4>
                    <ul class="inst-fund-container" >
                        <li v-for="(funder, key) in displayInstFunders" :key="key" >
                            {{funder.name}} - <span class="donated-amount" >{{parseDonation(funder.amount_donated)}}</span>
                        </li>
                    </ul>
                </div>
                <div class="individual" >
                    <ul class="ind-fund-container" >
                        <li v-for="(funder, key) in displayIndFunders" :key="key" >
                            {{funder.name}} - <span class="donated-amount" >{{parseDonation(funder.amount_donated)}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="pre-load">
            <img v-for="(credit, key) in allCredits" :key="key" :src="credit.image">
        </div>
    </div>    
</template>

<script>
import {db} from '../main.js'
import Credit from './Credit'
import DisplayModal from './Modal'

export default {
    components: {
        Credit, DisplayModal
    },
    data: function() {
        return {
            program: {},
            modalCredit: {},
            modalOpen: false,
            programId: null,
            creative: [],
            cast: [],
            organization: {
                funders: {
                        text: "", 
                        title_text: ""
                    }
            },
            staff: [],
            institutional: [],
            individual: []
        }
    },
    created: function() {
        this.programId = this.$route.params.id
    },
    firestore() {
        return {
            program: db.collection('programs').doc(this.$route.params.id),
            creative: db.collection('programs').doc(this.$route.params.id).collection('creative'),
            cast:  db.collection('programs').doc(this.$route.params.id).collection('cast')
        }
    },
    watch: {
        program: async function(newState, oldState) {
            if(newState.org_id) {
                console.log("program loaded!")
                const uid = newState.uid
                const orgRef = await db.collection('users').doc(uid).collection('organizations').doc(newState.org_id)
                const orgSnapshot = await orgRef.get()
                const org = orgSnapshot.data()
                this.organization = org

                const staffQuery = await orgRef.collection('staff').get()
                staffQuery.forEach(staff => {
                    const data = staff.data()
                    this.staff.push(data)
                })
                const institutionalQuery = await orgRef.collection('institutional').get()
                institutionalQuery.forEach(funder => {
                    const data = funder.data()
                    this.institutional.push(data)
                })
                const individualQuery = await orgRef.collection('individual').get()
                individualQuery.forEach(funder => {
                    const data = funder.data()
                    this.individual.push(data)
                })
            }
        }
    },
    computed: {
        featuredCreatives: function() {
            if (this.creative.length > 0) {
                let newArr = this.creative.filter(credit => {
                    return credit.featured === true;
                })
                return newArr
            } else {
                return this.creative
            }
        },
        regularCreatives: function() {
            if (this.creative.length > 0) {
                return this.creative.filter(credit => {
                    return credit.featured === false;
                })
            }
        },
        featuredCast: function() {
            if (this.cast.length > 0) {
                return this.cast.filter(credit => {
                    return credit.featured === true;
                })
            }
        },
        regularCast: function() {
            if (this.cast.length > 0) {
                return this.cast.filter(credit => {
                    return credit.featured === false;
                })
            }
        },
        displayInstFunders: function() {
            return this.institutional.sort((a, b) => {
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
            return this.individual.sort((a, b) => {
                if (a.amount_donated < b.amount_donated) {
                    return -1;
                }
                if (a.amount_donated > b.amount_donated) {
                    return 1;
                }
                return 0;
            })
        },
        allCredits: function() {
            return this.creative.concat(this.cast)
        },
        prodImage: function() {
            return this.program.image !== null ? this.program.image : "#"
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
        padding-top: 32px;
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

        .art img {
            max-width: 400px;
            max-height: 350px;
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
            .org-image {
                max-width: 400px;
                max-height: 300px;
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

        .pre-load {
            width: 0px;
            height: 0px;
            overflow: hidden;
        } 
        .hide {
            display: none;
        }       
    }

    @media (min-width: 500px) {
        .program {
            width: 700px;
            position: relative;
            left: calc(50vw - 350px);
            .art img {
                max-width: 700px;
                max-height: 450px;
            }
        }
    }

</style>
