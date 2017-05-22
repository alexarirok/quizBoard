angular.module('app').controller('appController', function ($scope, mySocket) {

    function init() {
        $scope.users = [];
        $scope.quiz = {};
        $scope.rightAnswerUsers = [];
        $scope.showQuizDashboard = false;

        if (localStorage.getItem('user')) {
            $scope.getNickName = false;
            $scope.nickName = localStorage.getItem('user');
        } else {
            $scope.getNickName = true;
        }
        if ($scope.nickName == 'AdminCreatorQuiz' && !$scope.getNickName) {
            $scope.showCreator = true;
            $scope.admin = true;
        } else {
            if (!$scope.getNickName) {
                $scope.participant = true;
            }
        }
    }
    $scope.startTimer = function () {
        var d1 = new Date(),
            d2 = new Date(d1);
        d2.setSeconds(d1.getSeconds() + 32);
        var countDownDate = d2.getTime();
        var x = setInterval(function () {
            var now = new Date().getTime();
            var distance = countDownDate - now;
           $scope.reminingSeconds = Math.floor((distance % (1000 * 60)) / 1000);
           $scope.$apply();
            if (distance < 0) {
                clearInterval(x);
              
            }
        }, 1000);
    }
    mySocket.on('online', function (msg) {
        $scope.users.push(msg.username);
    });


    $scope.addNickName = function () {
        mySocket.emit('online', { username: $scope.nickName });
        $scope.hideModel = true;
        localStorage.setItem('user', $scope.nickName);
        init();
    }

    $scope.sendAnswer = function (s, k, a) {
        if (s == k) {
            mySocket.emit('sendAnswer', { 'name': $scope.nickName });
            $scope.Ansstatus = 'correctanswer';
        } else {
            $scope.Ansstatus = 'wronganswer';
        }
        $scope.answered = true;
        $scope.myAnswer = a;

    }

    mySocket.on('sendAnswer', function (user) {
        $scope.rightAnswerUsers.push(user.name);
    })

    $scope.sendQuiz = function () {
        mySocket.emit('quizReady', { quiz: $scope.quiz });
        $scope.showQuizDashboard = true;

    }

    mySocket.on('quizReady', function (msg) {
        $scope.startTimer();
        $scope.showQuiz = true;
        $scope.quizObject = msg.quiz;
    })

    $scope.newQuestion = function () {
        mySocket.emit('reset');
    }
    mySocket.on('reset', function () {
        $scope.showCreator = true;
        $scope.showQuizDashboard = false;
        $scope.showQuiz = false;
        $scope.answered = false;
        $scope.quiz = {};
        $scope.rightAnswerUsers = [];
    });

    init();
})