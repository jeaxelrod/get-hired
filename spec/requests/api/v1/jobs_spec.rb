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
    expect(json).to eq([{ position: job1.position, company: job1.company, link: job1.link },
                        { position: job2.position, company: job2.comapny, link: job2.link }])
  end
  it "should return no jobs if user isn't logged in" do
    user = FactoryGirl.create(:user)
    job1 = FactoryGirl.create(:job, user: user)
    job2 = FactoryGirl.create(:job, user: user)

    get "/user/jobs"

    expect(response).to_not be_success
  end
end
