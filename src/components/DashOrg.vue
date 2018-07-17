<template>
    <div class="dash-org" >
        <span>
            {{organization.name}}
        </span>
         <div class="button-container" :class="{open: menuOpen}">
            <button class="menu-btn" @click="toggleMenuOpen" >
                <font-awesome-icon icon="ellipsis-v" ></font-awesome-icon>
            </button>
            <button class="edit-btn" @click="handleEditClick" >
                <font-awesome-icon icon="edit" ></font-awesome-icon>
            </button>
            <button class="delete-btn" @click="handleDeleteClick" >
                <font-awesome-icon icon="trash-alt" ></font-awesome-icon>
            </button>  
        </div>
        <div class="trash-modal-container" v-if="trashConfirm" :class="{open: trashOpen}">
            <div class="trash-modal-background"></div>
            <div class="trash-modal" >
                <button class="close-modal" @click="handleDeleteClose">
                    <font-awesome-icon icon="times" ></font-awesome-icon>
                </button>
                <span class="close-modal-text">
                    Are you sure?
                </span>
                <button class="delete-btn" @click="handleDeleteSubmit">
                    <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                    DELETE
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menuOpen: false,
            trashConfirm: false,
            trashOpen: false
        }
    },
    props: ['organization', 'user'],
    methods: {
        toggleMenuOpen() {
            return this.menuOpen = !this.menuOpen
        },
        handleDeleteClick() {
            this.trashConfirm = true
            setTimeout(()=> {
                this.trashOpen = true
            }, 100)
        },
        handleDeleteClose() {
            this.trashOpen = false
            setTimeout(() => {
                this.trashConfirm = false
            }, 600)
        },
        handleDeleteSubmit: async function() {
            const orgRef = db.collection('users').doc(this.user.uid).collection('organizations').doc(this.organization.id)
            const individualRef = orgRef.collection("individual")
            const institutionalRef = orgRef.collection("institutional")
            const staffRef = orgRef.collection("staff")
            const storageRef = storage.ref()
            let batch = db.batch()
            const individualQuery = await individualRef.get()
            individualQuery.forEach((individual) => {
                batch.delete(individual)
            })
            const institutionalQuery = await institutionalRef.get()
            institutionalQuery.forEach((institution) => {
                batch.delete(institution)
            })
            const staffQuery = await staffRef.get()
            staffQuery.forEach((staff) => {
                batch.delete(staff)
            })
            if (this.organization.image) {
                const rawPath = this.organization.image.substring(this.organization.image.indexOf("images"), this.organization.image.indexOf("?alt")).trim()
                const path = rawPath.replace(/%2F/g, '/')
                storageRef.child(path).delete()
            }
            batch.delete(orgRef)
            batch.commit()
                .then(() => {
                    console.log("batch committed")
                })
        },
        handleEditClick() {
            const path = {
                name: "editOrg",
                params: {
                    id: this.organization.id,
                    uid: this.user.uid
                }
            }
            this.$router.push(path)
        },
    }
    
}
</script>

<style lang="scss" scoped>
    @import '../assets/settings.scss';
    .dash-org {
        display: inline-block;
        .button-container {
            margin-top: 8px;
            position: relative;
            .menu-btn, .edit-btn, .delete-btn {
                position: absolute;
                @include button(40px, 40px, 14px);
                margin: 0 5px;
                border-radius: 50%;
                right: -60px;
                top: -37px;
                transition: transform .4s, opacity .4s, background-color .3s, color .3s;
            }
            .edit-btn, .delete-btn {
                opacity: 0;
            }
            .menu-btn {
                z-index: 2;
            }

            &.open {
                .edit-btn {
                    transform: translate(50px);
                    opacity: 1;
                }
                .delete-btn {
                    transform: translate(100px);
                    opacity: 1;
                }
            }
        }

        .trash-modal-container {
            .trash-modal-background {
                opacity: 0;
                transition: opacity .6s;
                background-color: $black;
                position: fixed;
                height: 100vh;
                width: 100vw;
                top: 0;
                left: 0;
                z-index: 5;
            }
            .trash-modal {
                background-color: $white;
                width: 250px;
                height: 120px;
                position: fixed;
                z-index: 5;
                top: calc(50vh - 60px);
                left: calc(50vw - 125px);
                opacity: 0;
                transition: opacity .6s;
                font-family: $body-font;
                .close-modal {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    padding-left: 5px;
                    @include button (20px, 20px, 14px)
                }
                span.close-modal-text {
                    display: block;
                    position: relative;
                    top: calc(50% - 10px);
                    text-align: center;
                }
                button.delete-btn {
                    @include button (100px, 30px, 12px);
                    display: block;
                    position: absolute;
                    bottom: 10px;
                    left: calc(50% - 50px);
                }
            }
            &.open {
                .trash-modal-background {
                    opacity: .5;
                }
                .trash-modal {
                    opacity: 1;
                }
            }
        }
    }

</style>
