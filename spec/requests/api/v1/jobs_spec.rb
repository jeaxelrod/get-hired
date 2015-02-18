describe "Jobs API" do
  include Warden::Test::Helpers
  Warden.test_mode!

  it "should return the users jobs" do
    user = FactoryGirl.create(:user)
    job1 = FactoryGirl.create(:job, user: user)
    job2 = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    get "/user/jobs"

    expect(response).to be_success
    json = JSON.parse(response.body)
    expect(json).to eq([JSON.parse(job2.to_json), JSON.parse(job1.to_json)])
  end
  it "should return no jobs if user isn't logged in" do
    user = FactoryGirl.create(:user)
    job1 = FactoryGirl.create(:job, user: user)
    job2 = FactoryGirl.create(:job, user: user)

    get "/user/jobs"

    expect(response).to_not be_success
    json = JSON.parse(response.body)
    expect(json).to eq({"error" => "You need to sign in or sign up before continuing."})
  end
end
