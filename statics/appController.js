angular.module('app').controller('appController', function ($scope, mySocket) {

    $scope.users = [];
    $scope.quiz = {};
    $scope.rightAnswerUsers = [];

    if (localStorage.getItem('user')) {
        $scope.getNickName = false;
        $scope.nickName = localStorage.getItem('user');
    } else {
        $scope.getNickName = true;
    }
    if ($scope.nickName == 'AdminCreatorQuiz') {
        $scope.showCreator = true;
        $scope.admin = true;
    } else {
        $scope.participant = true;
    }

    mySocket.on('online', function (msg) {
        $scope.users.push(msg.username);
    });


    $scope.addNickName = function () {
        mySocket.emit('online', { username: $scope.nickName });
        $scope.hideModel = true;
        localStorage.setItem('user', $scope.nickName);
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
    })

})