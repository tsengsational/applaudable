<template>
    <div class="program">
        <div class="presenter">
            <h3>Presented by {{program.organization.name}}</h3>
        </div>
        <div class="title" >
            <h1>{{program.title}}</h1>
            <h4>{{program.subtitle}}</h4>
        </div>
        <div class="featured-creative flex" >
            <credit v-for="(credit, key) in featuredCreatives" :key="key" :credit="credit" :type="'credited_role'" />
        </div>
        <div class="regular-creative flex" >
            <credit v-for="(credit, key) in regularCreatives" :key="key" :credit="credit" :type="'credited_role'" />
        </div>
        <div class="cast" >
            <h2 class="cast-title" ><span class="text line" >Featuring</span></h2>
            <div class="featured-cast-container flex">
                <credit v-for="(credit, key) in featuredCast" :key="key" :credit="credit" :type="'role'" />
            </div>
            <div class="regular-cast-container flex" >
                <credit v-for="(credit, key) in regularCast" :key="key" :credit="credit" :type="'role'" />
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
                    <credit v-for="(credit, key) in program.organization.staff" :key="key" :credit="credit" :type="'job_title'" />
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
import jsonImport from '../assets/program.json'
import Credit from './Credit'

export default {
    components: {
        Credit
    },
    data: function() {
        return {
            program: {}
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
        }
    }

</style>
