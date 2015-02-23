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

  it "should return all job applications for a user"
  it "should fail to return all job applications for a user if user isn't logged in"
  it "should return all job applications for a job"
  it "should fail to return all job applications for a job if user isn't logged in"
  it "should create new job applications"
  it "should fail to create a job application if user isn't logged in"
  it "should edit job application"
  it "should fail to edit job application if user isn't logged in"
  it "should delete job application"
  it "should fail to delete job application if user isn't logged in"
end
