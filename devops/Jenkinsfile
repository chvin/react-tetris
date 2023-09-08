pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Pipeline build started...'
		sh 'npm install'
		sh 'npm run build'
            }
            post {
                always{
                    archiveArtifacts(artifacts: 'devops/*.txt', fingerprint: true, followSymlinks: false)
                }
                success {
                    echo 'SUCCESS'
                }
                failure {
                    echo 'FAIL'
                    emailext body: "Pipeline build failed. Check the artifacts for details.",
                                     subject: "Pipeline failed",
                                     to: "luczak.roza@gmail.com",
                                     attachLog: true,
                                     attachmentsPattern: 'devops/*.txt'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Pipeline testing started...'
                sh 'npm test'
            }
            post {
                always{
                    archiveArtifacts(artifacts: 'devops/*.txt', fingerprint: true, followSymlinks: false)
                }
                success {
                    echo 'SUCCESS'
                }
                failure {
                    echo 'FAIL'
                    emailext body: "Pipeline tests failed. Check the artifacts for details.",
                                     subject: "Pipeline failed",
                                     to: "luczak.roza@gmail.com",
                                     attachLog: true,
                                     attachmentsPattern: 'devops/*.txt'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Pipeline deployment started...'
                sh 'docker-compose up --detach'
            }
            post {
                always{
                    archiveArtifacts(artifacts: 'devops/*.txt', fingerprint: true, followSymlinks: false)
                }
                success {
                    echo 'SUCCESS'
                }
                failure {
                    echo 'FAIL'
                    emailext body: "Pipeline deploy failed. Check the artifacts for details.",
                                     subject: "Pipeline failed",
                                     to: "luczak.roza@gmail.com",
                                     attachLog: true,
                                     attachmentsPattern: 'devops/*.txt'
                }
            }
        }
    }
}