angular.module('app').controller('appController', function ($scope, mySocket) {
    var timer = "";
    function init() {
        $scope.users = [];
        $scope.quiz = {};
        $scope.rightAnswerUsers = [];
        $scope.showQuizDashboard = false;
        $scope.totalRightAnswer = 0;
        $scope.userResult = [];

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
        $scope.reminingSeconds = " ";
        $scope.$apply();
        var d1 = new Date(),
            d2 = new Date(d1);
        d2.setSeconds(d1.getSeconds() + 32);
        var countDownDate = d2.getTime();
        timer = setInterval(function () {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            $scope.reminingSeconds = Math.floor((distance % (1000 * 60)) / 1000);
            $scope.$apply();

            if (distance <= 0) {
                clearInterval(timer);
                mySocket.emit('timeout')
            }
        }, 1000);
    }
    mySocket.on('timeout', function () {
        $scope.showQuiz = false;
        $scope.timeout = true;
        setTimeout(function () {
            $scope.timeout = false;
            $scope.$apply();

        }, 5000)
    })
    mySocket.on('online', function (msg) {
        $scope.users.push(msg.username);
        $scope.$apply();
    });


    $scope.addNickName = function () {
        mySocket.emit('online', { username: $scope.nickName });
        $scope.hideModel = true;
        localStorage.setItem('user', $scope.nickName);
        init();
    }
    $scope.endGame = function () {
        mySocket.emit('end');
    }
    $scope.sendAnswer = function (s, k, a) {
        if (s == k) {
            mySocket.emit('sendAnswer', { 'name': $scope.nickName });
            $scope.Ansstatus = 'correctanswer';
            $scope.totalRightAnswer++;

        } else {
            $scope.Ansstatus = 'wronganswer';
        }
        clearInterval(timer);
        $scope.answered = true;
        $scope.myAnswer = a;

    }

    mySocket.on('end', function () {
        if ($scope.getNickName != 'AdminCreatorQuiz') {
            mySocket.emit('myScore', { name: $scope.nickName, score: $scope.totalRightAnswer })
        }
        $scope.QuizEnd = true;
    })
    mySocket.on('myScore', function (score) {
        $scope.userResult.push(score);
    })

    mySocket.on('sendAnswer', function (user) {
        $scope.rightAnswerUsers.push(user.name);
        $scope.reminingSeconds = " ";
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
        clearInterval(timer);

    });

    init();
})