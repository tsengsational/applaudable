<template>
    <div class="home" >
        <div class="hero-container" >
            <div class="hero" :style="heroStyle" ></div>
            <div class="hero-content">
                <h1>Never printing a program again? Bravo.</h1>
                <h3>Easy mobile-optimized programs for any event</h3>
                <button @click="handleSignUpClick" >Sign Up</button>
            </div>
        </div>
        <div class="feature-container flex" >
            <div v-for="(feature, key) in features" :key=key class="feature">
                <div class="icon">
                    <font-awesome-icon :icon="feature.icon"></font-awesome-icon>
                </div>
                <h3>
                    {{feature.title}}
                </h3>
                <p class="caption">
                    {{feature.caption}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            features: [
                {
                    title: "Go Paperless",
                    caption: "Save on expensive print jobs and help the environment all in one step!",
                    icon: "tree",
                },
                {
                    title: "Engage Your Audience",
                    caption: "The web doesn't have the same limitations as paper. Deepen your audience experience with special content.",
                    icon: "thumbs-up"
                },
                {
                    title: "Free to Use",
                    caption: "Making a program is always free. Pro features accessible with a simple pricing plan.",
                    icon: "coins"
                }
            ]
        }
    },
    computed: {
        backgroundImage () {
            return require('../assets/crowd.jpg')
        },
        heroStyle () {
            return {
                backgroundImage: `url(${this.backgroundImage})`
            }
        }
    },
    methods: {
        handleSignUpClick () {
            const path = {
                name: 'login',
                query: {
                    signUp: true
                }
            }
            this.$router.push(path)
        }
    }

    
}

</script>

<style lang="scss" scoped>
    @import '../assets/settings.scss';
    $hero-height: 400px;
    $hero-height-desktop: 500px;
    .flex {
        display: flex;
    }

    .hero-container {
        position: relative;
        .hero {
            // background-image: url('/crowd.jpg');
            background-position: center;
            background-size: cover;
            width: 100vw;
            height: $hero-height;
            &::before {
                content: "";
                position: absolute;
                width: 100vw;
                height: $hero-height;
                background-color: $black;
                opacity: .3;
                left: 0;
            }
        }
        .hero-content {
            position: absolute;
            top: calc(200px - 150px);
            left: calc(50vw - 150px);
            color: $white;
            height: 300px;
            width: 300px;
            text-shadow: 0 0 10px $black;
            h3 {
                font-family: $body-font;
            }
            button {
                @include button (150px, 40px, 12px)
            }
        }
    }

    .feature-container {
        padding: 32px 12px;
        flex-direction: column;
        .feature {
            width: 100%;
            margin: 16px 0;
            padding: 0 16px;
            box-sizing:border-box;
            .icon {
                font-size: 32px;
                transition: color .3s;
            }
            h3 {
                color: auto;
                transition: color .3s;
            }
            p.caption {
                font-family: $body-font;
            }
            &:hover {
                .icon, h3 {
                    color: $yellow;
                }
            }
        }
    }

    @media (min-width: 500px) {
        .hero {
            height: $hero-height-desktop;
            &::before {
                height: $hero-height-desktop;
            }
        }
        .feature-container {
            flex-direction: row;
            width: 70vw;
            position: relative;
            left: 15vw;
            .feature {
                width: 33%;
            }
        }
    }


</style>
