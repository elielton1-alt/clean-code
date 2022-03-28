import { rejects } from 'assert'
import {DbAddAccount} from './db-add-account'
import {Encrypter , AddAccountModel, AccountModel, AddAccountRepository} from './db-add-account-protocols'


const makeEncrypter = ():Encrypter => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))  
    }
  } 
  return new EncrypterStub()
}

const makeAddAccountRepository = ():AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel>{
      const fakeAccount = {
        id:'valid_id',
        name:'valid_name',
        email:'valid_email',
        password:'hashed_password'
      }
      return new Promise(resolve => resolve(fakeAccount))  
    }
  } 
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter,
  addAccountRepositoruStub: AddAccountRepository
}

const makeSut = () : SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoruStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub,addAccountRepositoruStub)
    return {
      sut,
      encrypterStub,
      addAccountRepositoruStub
    }
  }
  
describe('DbAddAccount Usecase', () => {
   test('Should call Encrypter with correct password',async () =>{
    const {sut, encrypterStub} = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
   })

   test('Should call AddAcoountRepository with correct values',async () =>{
    const {sut, addAccountRepositoruStub} = makeSut()
    const encryptSpy = jest.spyOn(addAccountRepositoruStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
   })

  //  test('Should throw if Encrypter throws',async () =>{
  //   const {sut, addAccountRepositoruStub} = makeSut()
  //   jest.spyOn(addAccountRepositoruStub, 'add').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
  //   const accountData = {
  //     name: 'valid_name',
  //     email: 'valid_email',
  //     password: 'valid_password'
  //   }
  //   const promise = await sut.add(accountData)
  //   expect(promise).rejects.toThrow()
  //  })


   test('Should return an account on success',async () =>{
    const {sut} = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
   })

})