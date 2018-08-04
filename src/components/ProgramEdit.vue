<template>
    <div class="program-edit-view">
        <display-modal :modalCredit="modalCredit" :modal-open="modalOpen" @modalClose="toggleModal" />
        <div class="presenter">
            <h3>Presented by {{organization.name}}</h3>
        </div>
        <div class="program_edit" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" >
            <div class="art" >
                <img :src="prodImage" >
            </div>
            <div class="title" :class="{hide: program.hide_title}" >
                <h1>{{program.title}}</h1>
                <h4>{{program.subtitle}}</h4>
            </div>
            <button class="edit-btn" :class="{show: showEditButton.program_edit}" @click.prevent="handleProgramEdit" >
                <font-awesome-icon icon="edit" ></font-awesome-icon>
            </button>
        </div>
        <div class="creative" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" >
            <div class="featured-creative flex" >
                <credit v-for="(credit, key) in featuredCreatives" :key="key" :credit="credit" :programId="programId" :creditType="'creative'" :type="'credited_role'" :editing="true" @creditClick="handleCreditClick" ></credit>
            </div>
            <div class="regular-creative flex" >
                <credit v-for="(credit, key) in regularCreatives" :key="key" :credit="credit" :programId="programId" :creditType="'creative'" :type="'credited_role'" :editing="true" @creditClick="handleCreditClick" />
            </div>
            <button class="add-btn creative" :class="{show: showEditButton.creative}" @click.prevent="handleAddCredit" > <font-awesome-icon icon="plus" ></font-awesome-icon> </button>
        </div>
        <div class="cast" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" >
            <h2 class="cast-title" ><span class="text line" >Featuring</span></h2>
            <div class="featured-cast-container flex">
                <credit v-for="(credit, key) in featuredCast" :key="key" :credit="credit" :programId="programId" :creditType="'cast'" :type="'role'" :editing="true" @creditClick="handleCreditClick" />
            </div>
            <div class="regular-cast-container flex" >
                <credit v-for="(credit, key) in regularCast" :key="key" :credit="credit" :programId="programId" :creditType="'cast'" :type="'role'" :editing="true" @creditClick="handleCreditClick" />
            </div>
            <button class="add-btn cast" :class="{show: showEditButton.cast}" @click.prevent="handleAddCredit" > <font-awesome-icon icon="plus" ></font-awesome-icon> </button>
        </div>
        <div class="organization"  >
            <div class="org_edit" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" >
                <h2 class="line" >About {{organization.name}}</h2>
                <img class="org-image" :src="organization.image" alt="">
                <p class="org-about" >
                    {{organization.about}}
                </p>
                <button class="edit-btn" :class="{show: showEditButton.org_edit}" @click.prevent="handleOrgEdit" >
                    <font-awesome-icon icon="edit" ></font-awesome-icon>
                </button>
            </div>
            <div class="org-staff" >
                <h4>Staff</h4>
                <div class="org-staff-container flex" >
                    <credit v-for="(credit, key) in staff" :key="key" :credit="credit" :creditType="'staff'" :editing="true" :type="'role'" />
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
import {auth, db} from '../main.js'
import Credit from './Credit'
import DisplayModal from './Modal'



export default {
    components: {
        Credit, DisplayModal
    },
    props: ['user'],
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
            individual: [],
            showEditButton: {
                program_edit: null,
                org_edit: null,
                cast: null,
                creative: null
            }
        }
    },
    mounted: function() {
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

                console.log("created with", uid)
                if (auth.currentUser.uid !== uid) {
                    this.$router.push('/login')
                    console.log("wrong user!")
                } else {
                    console.log("correct user!")
                }

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
                    return credit.featured == false;
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
                    return credit.featured == false;
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
        },
        displayCreditClass: function(index) {
            return 
        }
    },
    methods: {
            parseDonation: function(num) {
                return num.toLocaleString()
            },
            handleAddCredit: function(event) {
                const id = this.program.id
                const type = event.target.classList[1]
                const path = {
                    name: "AddCredit",
                    params: {
                        id: id,
                        type: type
                    }
                }
                this.$router.push(path)
            },
            handleCreditClick: function(credit) {
                this.modalCredit = credit;
                console.log(this.modalCredit.name)
                this.toggleModal()
            },
            handleMouseEnter: function(event) {
                const className = event.target.classList[0]
                this.showEditButton[className] = true
            },
            handleMouseLeave: function(event) {
                const className = event.target.classList[0]
                this.showEditButton[className] = false
            },
            handleOrgEdit: function() {
                const uid = this.user.uid
                const orgId = this.organization.id
                const path = {
                    name: 'editOrg',
                    params: {
                        uid: uid,
                        id: orgId
                    }
                }
                this.$router.push(path)

            },
            handleProgramEdit: function(event) {
                const path = {name: "editProgramForm", params: {id: this.$route.params.id}}
                this.$router.push(path)
            },
            toggleModal: function() {
                this.modalOpen = !this.modalOpen
            }
        }
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';
    .program-edit-view {
        padding-top: 32px;

        .program_edit, .credit_container, .org_edit {
            position: relative;
        }

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
        .cast, .creative {
            position: relative;
        }

        button.edit-btn, .add-btn {
            position: absolute;
            right: 30px;
            bottom: 30px;
            height: 30px;
            width: 30px;
            border-radius: 50%;
            border: 1px $gray solid;
            background-color: $gray;
            opacity: 1;
            color: $white;
            text-align:center;
            padding-left: 8px;
            transition: opacity .3s, background-color .3s, color .3s, border .3s;
            &.show {
                opacity: 1;
            }
            &:hover {
                background-color: $yellow;
                border: 1px $yellow solid;
                color: $black;
            } 
        }

        button.add-btn {
            bottom: 10px;
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
        .program-edit-view {
            width: 700px;
            position: relative;
            left: calc(50vw - 350px);
            .art img {
                max-width: 700px;
                max-height: 450px;
            }
            button.edit-btn, button.add-btn {
                opacity: 0;
                &.show {
                    opacity: 1;
                }
            }
        }
    }

    @media (min-width: 1000px) {
        .program-edit-view {
            .program-edit {
                width: 700px;
                position: relative;
                left: calc( 50vw - 350px);
            }
        }
    }

</style>
