window.onload = function () {
    Vue.component('modal', {
        template: '#modal-template'
    });

    var thc = new Vue({
        el: '#thc',
        data: {
            criteria: [],
            teams: [],
            teamList: [],
            selectedTeam: null,
            newTeamName: '',
            database: null
        },
        created: function () {
            this.initialiseDatabase();
            this.retrieveInitialData();
        },
        methods: {
            initialiseDatabase() {
                // Initialize Firebase
                var config = {
                    apiKey: "AIzaSyBQ9Eo9cpSCRld4vpzjmV1XrgcDiWCE3Hc",
                    authDomain: "team-health-check-9141c.firebaseapp.com",
                    databaseURL: "https://team-health-check-9141c.firebaseio.com",
                    projectId: "team-health-check-9141c",
                    storageBucket: "",
                    messagingSenderId: "60524480289"
                };

                firebase.initializeApp(config);
                this.database = firebase.database();
            },
            retrieveInitialData() {
                // Get data from firebase
                firebase.database().ref('testhealthcheck/teams').once('value').then(function (snapshot) {
                    this.teams = snapshot.val();
                    this.teamList = [];

                    // Set up teamList, which is used to populate the remove team dropdown
                    this.teams.forEach(function (team) {
                        var newTeam = {
                            value: team.id,
                            text: team.name
                        };
                        this.teamList.push(newTeam);
                    }.bind(this));
                }.bind(this));

                firebase.database().ref('testhealthcheck/criteria').once('value').then(function (snapshot) {
                    this.criteria = snapshot.val();
                    // ...
                }.bind(this));
            },
            getCriterionValue(team, criterion) {
                return team[criterion.value];
            },
            changeCriterionValue(team, criterion, direction) {
                var valueToChange = team[criterion.value];

                if ((valueToChange == 'R' || valueToChange == 'Rdown') && direction == 'up') {
                    team[criterion.value] = 'Aup';

                } else if (valueToChange == 'A' || valueToChange == 'Aup' || valueToChange == 'Adown') {
                    if (direction == 'up') {
                        team[criterion.value] = 'Gup';
                    } else {
                        team[criterion.value] = 'Rdown';
                    }

                } else if ((valueToChange == 'G' || valueToChange == 'Gup') && direction == 'down') {
                    team[criterion.value] = 'Adown';
                }
            },
            setInitialValue(team, criterion) {
                switch (team[criterion.value]) {
                    case '':
                        team[criterion.value] = 'R';
                        break;
                    case 'R':
                    case 'Rdown':
                        team[criterion.value] = 'A';
                        break;
                    case 'A':
                    case 'Aup':
                    case 'Adown':
                        team[criterion.value] = 'G';
                        break;
                    case 'G':
                    case 'Gup':
                        team[criterion.value] = '';
                    default:
                        team[criterion.value] = '';
                }
            },

            // Saves the current values, including any modifications made by the user
            save() {
                // Save to firebase
                firebase.database().ref('testhealthcheck/teams').set(this.teams);
                firebase.database().ref('testhealthcheck/criteria').set(this.criteria);

            },
            // Retrieves the previous values before any of the changes made in the current session were applied
            reset() {
                this.retrieveInitialData();
            },
            showAddTeamModal() {
                this.$refs.addTeamModal.show();
            },
            showRemoveTeamModal() {
                this.$refs.removeTeamModal.show();
            },
            // Removes the team selected in the remove team modal
            removeTeamFromModal() {
                var newTeams = this.teams.filter(function (team) {
                    return team.id !== this.selectedTeam;
                }.bind(this));
                this.teams = newTeams;
                this.updateTeamList();
                this.$refs.removeTeamModal.hide();
            },
            // Adds new team based on team name that has been input into the text field in the Add Team modal
            addTeamFromModal() {
                // Check that the team name isn't empty (default). May want to add additional validation here...
                if (this.newTeamName != '') {
                    this.teams.push({
                        id: this.generateTeamId(),
                        name: this.newTeamName,
                        support: '',
                        teamwork: '',
                        pawnsOrPlayers: '',
                        mission: '',
                        healthOfCodebase: '',
                        suitableProcess: '',
                        deliveringValue: '',
                        learning: '',
                        speed: '',
                        easyToRelease: '',
                        fun: ''
                    });
                    this.updateTeamList();
                    this.newTeamName = '';
                    this.$refs.addTeamModal.hide();
                }
            },
            generateTeamId() {
                var teamIds = [];
                this.teams.forEach(function (team) {
                    teamIds.push(team.id);
                });
                for (var i = 0; i <= this.teams.length; i++) {
                    if (!teamIds.includes(i)) {
                        console.log('Found unused team id (' + i + ') - assigning this to the new team');
                        return i;
                    }
                }
            },
            updateTeamList() {
                this.teamList = [];

                this.teams.forEach(function (team) {
                    var newTeam = {
                        value: team.id,
                        text: team.name
                    };
                    this.teamList.push(newTeam);
                }.bind(this));
            }
        }
    });
}
