describe "Job Applications API" do
  include Warden::Test::Helpers
  Warden.test_mode!

  it "should return a job's application" do
    app = FactoryGirl.create(:job_application)
    user = app.user
    job = app.job
    login_as(user, :scope => :user)

    get "/user/jobs/#{job.id}/job_applications/#{app.id}"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json).to eq(JSON.parse(app.to_json))
  end

  it "should fail to return a job application if it doesn't exist" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    get "/user/jobs/#{job.id}/job_applications/#{1}"

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "No Job Applications found"})
  end

  it "should fail to return a job application if user isn't logged in" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job)
    app = FactoryGirl.create(:job_application, job: job, user: user)

    get "/user/jobs/#{job.id}/job_applications/#{app.id}"

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end

  it "should return all job applications for a user" do
    job1 = FactoryGirl.create(:job)
    user = job1.user
    job2  = FactoryGirl.create(:job, user: user)
    app1 = FactoryGirl.create(:job_application, job: job1)
    app2 = FactoryGirl.create(:job_application, job: job2)
    login_as(user, :scope => :user)

    get "user/job_applications"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json).to include(JSON.parse(app1.to_json))
    expect(json).to include(JSON.parse(app2.to_json))
  end

  it "should fail to return all job applications for a user if user isn't logged in" do
    job1 = FactoryGirl.create(:job)
    user = job1.user
    job2  = FactoryGirl.create(:job, user: user)
    app1 = FactoryGirl.create(:job_application, job: job1)
    app2 = FactoryGirl.create(:job_application, job: job2)

    get "user/job_applications"

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end

  it "should return all job applications for a job" do
    job = FactoryGirl.create(:job)
    user = job.user
    app1 = FactoryGirl.create(:job_application, job: job)
    app2 = FactoryGirl.create(:job_application, job: job)
    login_as(user, :scope => :user)

    get "user/jobs/#{job.id}/job_applications"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json).to include(JSON.parse(app1.to_json))
    expect(json).to include(JSON.parse(app2.to_json))
  end

  it "should fail to return all job applications for a job if user isn't logged in" do
    job = FactoryGirl.create(:job)
    user = job.user
    app1 = FactoryGirl.create(:job_application, job: job)
    app2 = FactoryGirl.create(:job_application, job: job)

    get "user/jobs/#{job.id}/job_applications"

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end

  it "should create new job applications" do
    job = FactoryGirl.create(:job)
    user = job.user
    new_app = { date_applied:   DateTime.now,
                comments:      "Some comments",
                communication: "John HR",
                status:        "Applied" }
    login_as(user, :scope => :user)

    post "/user/jobs/#{job.id}/job_applications", :job_application => new_app

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json).to eq(JSON.parse(job.job_applications[0].to_json))
    expect(json).to eq(JSON.parse(user.job_applications[0].to_json))
  end

  it "should fail to create a job application if user isn't logged in" do
    job = FactoryGirl.create(:job)
    user = job.user
    new_app = { date_applied:   DateTime.now,
                comments:      "Some comments",
                communication: "John HR",
                status:        "Applied" }

    post "/user/jobs/#{job.id}/job_applications", :job_application => new_app

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end

  it "should fail to create job application from another user's job" do
    user1 = FactoryGirl.create(:user)
    user2 = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user2)
    login_as(user1, :scope => :user)
    new_app = { date_applied:   DateTime.now,
                comments:      "Some comments",
                communication: "John HR",
                status:        "Applied" }

    post "/user/jobs/#{job.id}/job_applications", :job_application => new_app

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "Unable to create job application"})
  end

  it "should edit job application" do
    job = FactoryGirl.create(:job)
    user = job.user
    app = FactoryGirl.create(:job_application, job: job)
    edited_app = { comments: "Yay comments" }
    login_as(user, :scope => :user)

    put "/user/jobs/#{job.id}/job_applications/#{app.id}", :job_application => edited_app
    
    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json["comments"]).to eq(edited_app[:comments])
    expect(job.job_applications[0].to_json).to include(edited_app[:comments])
  end

  it "should fail to edit job application if user isn't logged in" do 
    job = FactoryGirl.create(:job)
    user = job.user
    app = FactoryGirl.create(:job_application, job: job)
    edited_app = { comments: "Yay comments" }

    put "/user/jobs/#{job.id}/job_applications/#{app.id}", :job_application => edited_app

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end

  it "should delete job application"
  it "should fail to delete job application if user isn't logged in"
end
