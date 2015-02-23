describe "Job Applications API" do
  include Warden::Test::Helpers
  Warden.test_mode!

  it "should return a job's application"
  it "should fail to return a job application if user isn't logged in"
  it "should create new job applications"
  it "should fail to create a job application if user isn't logged in"
  it "should edit job application"
  it "should fail to edit job application if user isn't logged in"
  it "should delete job application"
  it "should fail to delete job application if user isn't logged in"
end
