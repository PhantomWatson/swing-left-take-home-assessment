describe('Voter registration deadlines API endpoint', () => {
  it('sends the expected response', () => {
    cy.request('/api/registration_deadlines').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.eq('application/json');
      expect(response.body).to.be.an('array').with.lengthOf(51);
    })
  })
});
