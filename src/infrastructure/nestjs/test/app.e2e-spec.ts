import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../App.module';
import {
  MockStorageService,
  STORAGE_SERVICE,
} from './mocks/MockStorageService';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(STORAGE_SERVICE)
      .useClass(MockStorageService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    token = jwtService.sign({ userId: 'testUser' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/sendMessage (POST)', () => {
    const testMessage = 'Hello';
    return request(app.getHttpServer())
      .post('/sendMessage')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'testUser', message: testMessage })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual({
          response:
            "I'm here to listen and support you. How can I help you today?",
        });
      });
  });

  it('/initiateCheckIn (POST)', () => {
    return request(app.getHttpServer())
      .post('/initiateCheckIn')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'testUser' })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual({
          response: 'Hi! How are you doing today?',
        });
      });
  });

  it('/retrieveContext/:userId (GET)', async () => {
    const testContext = { testKey: 'testValue', anotherKey: 123 };
    await request(app.getHttpServer())
      .post('/updateContext')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'testUser', context: testContext });
    return request(app.getHttpServer())
      .get('/retrieveContext/testUser')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual({
          context: {
            anotherKey: 123,
            testKey: 'testValue',
          },
        });
      });
  });

  it('/updateContext (POST)', () => {
    const testContext = { testKey: 'testValue', anotherKey: 123 };
    return request(app.getHttpServer())
      .post('/updateContext')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'testUser', context: testContext })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'Context updated successfully',
        });
      });
  });

  it('should update context after sending a message', async () => {
    const message = 'What are your office hours?';

    // Send a message
    const sendMessageResponse = await request(app.getHttpServer())
      .post('/sendMessage')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'testUser', message })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(sendMessageResponse.body).toEqual({
      response: expect.any(String),
    });

    // Retrieve the updated context
    return request(app.getHttpServer())
      .get('/retrieveContext/testUser')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual({
          context: {
            currentFlow: 'NORMAL',
            lastIntent: 'FAQ',
            lastMessage: 'What are your office hours?',
            lastResponse:
              "Our office hours are 9 AM to 5 PM, Monday through Friday. For more details, please check the 'Contact Us' section on our FAQ page at https://www.clareandme.com/faq.",
          },
        });
      });
  });
});
